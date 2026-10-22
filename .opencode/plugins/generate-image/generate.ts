/**
 * Blog image generation for jonathanfreire.com.
 *
 * Ported from the former `blog-image` skill script. It generates a cover or an
 * in-post figure with the OpenAI Images API (gpt-image-2.5-sunburst), centre
 * crops it to an exact size with `sips` and uploads it to Cloudinary under
 * `portfolio/blog/`, returning the markdown line to paste into the post.
 *
 * Zero dependencies beyond the Node runtime. Requires `sips` (macOS) for the
 * crop step. Credentials come from `portfolio/.env` or from real environment
 * variables, and real environment variables win. Secrets are never returned or
 * logged.
 *
 * Guards: the generator only runs inside the portfolio repo, and every asset it
 * writes is forced under `portfolio/blog/`. That Cloudinary belongs to the
 * portfolio and must not receive images for another project.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = "gpt-image-2.5-sunburst";
const DEFAULT_QUALITY = "medium";
const QUALITIES = new Set(["low", "medium", "high", "xhigh", "max", "auto"]);

type FormatSpec = { readonly api: string; readonly mime: string; readonly extension: string };

const FORMATS: Record<string, FormatSpec> = {
  jpeg: { api: "jpeg", mime: "image/jpeg", extension: "jpg" },
  png: { api: "png", mime: "image/png", extension: "png" },
  webp: { api: "webp", mime: "image/webp", extension: "webp" },
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SIZE_PATTERN = /^(\d{2,4})x(\d{2,4})$/;

// The site renders the cover at 1400x800 and body images around 1400x900.
const SIZE_PRESETS: Record<string, { width: number; height: number }> = {
  cover: { width: 1400, height: 800 },
  inline: { width: 1400, height: 900 },
};

// The API only accepts edges that are multiples of 16, so the generation size
// rounds up and the extra pixels are centre cropped away after.
const SIZE_MULTIPLE = 16;
const MAX_EDGE = 3840;
const MIN_PIXELS = 655_360;
const MAX_PIXELS = 8_294_400;

const PUBLIC_ID_PREFIX = "portfolio/blog/";

// Markers of the portfolio repo, used by the project guard.
const PORTFOLIO_MARKERS = ["next.config.ts", "locales", "posts/en"];
const MAX_ANCESTOR_LEVELS = 5;

const WORK_DIR = path.join(tmpdir(), "blog-image");

const REQUIRED_CREDENTIALS = [
  "OPENAI_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

export type ImageFormat = "jpeg" | "png" | "webp";
export type ImageQuality = "low" | "medium" | "high" | "xhigh" | "max" | "auto";

export interface BlogImageRequest {
  /** Post slug, lowercase kebab-case, identical to the post filename. */
  readonly slug: string;
  /** What the image should show. */
  readonly prompt: string;
  /** Markdown alt text. For a cover this is the post title. */
  readonly alt: string;
  /** Suffix for an in-post figure (`figure-3`, `architecture`). Omit for a cover. */
  readonly name?: string;
  /** `cover` (1400x800), `inline` (1400x900) or an explicit `WxH`. */
  readonly size?: string;
  /** Output format. Use `png` for diagrams and charts with text. */
  readonly format?: ImageFormat;
  readonly quality?: ImageQuality;
  readonly model?: string;
  /** Resolve and validate everything without calling OpenAI or Cloudinary. */
  readonly dryRun?: boolean;
}

export interface BlogImagePlan {
  readonly projectRoot: string;
  readonly publicId: string;
  readonly extension: string;
  readonly model: string;
  readonly quality: string;
  readonly generation: { readonly width: number; readonly height: number };
  readonly target: { readonly width: number; readonly height: number };
  readonly dryRun: boolean;
}

export interface BlogImageSuccess {
  readonly status: "success";
  readonly plan: BlogImagePlan;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly markdown: string;
}

export interface BlogImageDryRun {
  readonly status: "dry-run";
  readonly plan: BlogImagePlan;
}

export type BlogImageOutcome = BlogImageSuccess | BlogImageDryRun;

export interface GenerateOptions {
  /** Directory the generator starts searching from for the portfolio root. */
  readonly startDir: string;
  /** Cancels the network work when the session stops. */
  readonly signal?: AbortSignal;
  /** Environment override, mostly for tests. Defaults to `process.env`. */
  readonly env?: NodeJS.ProcessEnv;
}

export class BlogImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlogImageError";
  }
}

function fail(message: string): never {
  throw new BlogImageError(message);
}

function isPortfolioRoot(dir: string): boolean {
  return PORTFOLIO_MARKERS.every((marker) => existsSync(path.join(dir, marker)));
}

/**
 * Looks for the portfolio repo from the starting directory: the directory
 * itself, a `portfolio` child, or an ancestor with either of those. Returns
 * null when running outside the project.
 */
function findPortfolioRoot(startDir: string): string | null {
  let current = path.resolve(startDir);
  for (let level = 0; level <= MAX_ANCESTOR_LEVELS; level += 1) {
    for (const candidate of [current, path.join(current, "portfolio")]) {
      if (isPortfolioRoot(candidate)) return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function loadEnvFile(filePath: string): NodeJS.ProcessEnv {
  if (!existsSync(filePath)) return {};
  const vars: NodeJS.ProcessEnv = {};
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) vars[key] = value;
  }
  return vars;
}

function roundUpToMultiple(value: number, factor: number): number {
  return Math.ceil(value / factor) * factor;
}

function parseSize(value: string): { width: number; height: number } {
  if (SIZE_PRESETS[value]) return SIZE_PRESETS[value];
  const match = value.match(SIZE_PATTERN);
  if (!match) {
    fail(`Invalid size "${value}". Use cover, inline or WxH (for example 1200x1200).`);
  }
  return { width: Number(match[1]), height: Number(match[2]) };
}

function resolveCredentials(projectRoot: string, env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const merged = { ...loadEnvFile(path.join(projectRoot, ".env")), ...env };
  const missing = REQUIRED_CREDENTIALS.filter((key) => !merged[key]);
  if (missing.length > 0) {
    fail(
      `Missing ${missing.join(", ")} in the environment or in ${path.join(projectRoot, ".env")}. ` +
        `Add them to portfolio/.env (see .opencode/plugins/generate-image/.env.example).`,
    );
  }
  return merged;
}

function planRequest(request: BlogImageRequest, startDir: string): BlogImagePlan {
  const { slug } = request;
  const { prompt, alt } = request;
  const name = request.name;
  const isDryRun = request.dryRun === true;
  const model = request.model ?? DEFAULT_MODEL;
  const quality = request.quality ?? DEFAULT_QUALITY;
  const format = FORMATS[request.format ?? "jpeg"];

  if (!slug || !prompt || !alt) {
    fail("slug, alt and prompt are all required.");
  }
  if (!format) {
    fail(`Invalid format "${request.format}". Use jpeg, png or webp.`);
  }
  if (!QUALITIES.has(quality)) {
    fail(`Invalid quality "${quality}". Use one of ${[...QUALITIES].join(", ")}.`);
  }
  if (!SLUG_PATTERN.test(slug)) {
    fail(`Invalid slug "${slug}". Use lowercase kebab-case, as in the post filename.`);
  }
  if (name !== undefined && !SLUG_PATTERN.test(name)) {
    fail(`Invalid name "${name}". Use lowercase kebab-case, as in "figure-1".`);
  }

  const projectRoot = findPortfolioRoot(startDir);
  if (!projectRoot) {
    fail(
      "Refusing to run: this is not the jonathanfreire.com portfolio repo.\n" +
        "This tool only writes to the portfolio's Cloudinary, never for another project.\n" +
        `Run it from inside the portfolio repo (markers: ${PORTFOLIO_MARKERS.join(", ")}).`,
    );
  }

  const publicId = `${PUBLIC_ID_PREFIX}${slug}${name ? `-${name}` : ""}`;
  if (!publicId.startsWith(PUBLIC_ID_PREFIX) || publicId.includes("..")) {
    fail(`Refusing to write outside ${PUBLIC_ID_PREFIX}.`);
  }

  const target = parseSize(request.size ?? "cover");
  const generation = {
    width: roundUpToMultiple(target.width, SIZE_MULTIPLE),
    height: roundUpToMultiple(target.height, SIZE_MULTIPLE),
  };

  if (
    generation.width > MAX_EDGE ||
    generation.height > MAX_EDGE ||
    generation.width * generation.height < MIN_PIXELS ||
    generation.width * generation.height > MAX_PIXELS
  ) {
    fail(
      `The size ${target.width}x${target.height} is outside what the image API supports. ` +
        `Keep the generation size (${generation.width}x${generation.height}) within ${MAX_EDGE}px per edge and ` +
        `${MIN_PIXELS} to ${MAX_PIXELS} total pixels.`,
    );
  }

  return {
    projectRoot,
    publicId,
    extension: format.extension,
    model,
    quality,
    generation,
    target,
    dryRun: isDryRun,
  };
}

function describeErrorBody(status: number, body: unknown): string {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return `Request failed (${status}): ${text.slice(0, 2000)}`;
}

async function generateWithOpenAI(
  request: BlogImageRequest,
  plan: BlogImagePlan,
  credentials: NodeJS.ProcessEnv,
  signal: AbortSignal | undefined,
): Promise<Buffer> {
  const format = FORMATS[request.format ?? "jpeg"];
  const response = await fetch(OPENAI_IMAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: plan.model,
      prompt: request.prompt,
      size: `${plan.generation.width}x${plan.generation.height}`,
      quality: plan.quality,
      output_format: format.api,
      n: 1,
    }),
    signal,
  });

  if (!response.ok) {
    throw new BlogImageError(describeErrorBody(response.status, await response.text()));
  }

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const firstImage = payload.data?.[0];

  let imageBuffer: Buffer | undefined;
  if (firstImage?.b64_json) {
    imageBuffer = Buffer.from(firstImage.b64_json, "base64");
  } else if (firstImage?.url) {
    const download = await fetch(firstImage.url, { signal });
    if (!download.ok) {
      throw new BlogImageError(describeErrorBody(download.status, await download.text()));
    }
    imageBuffer = Buffer.from(await download.arrayBuffer());
  }

  if (!imageBuffer) {
    throw new BlogImageError("The OpenAI response contained no image data.");
  }
  return imageBuffer;
}

/** Centre crops with macOS `sips` and verifies the final dimensions. */
function cropToExactSize(
  imageBuffer: Buffer,
  plan: BlogImagePlan,
  format: FormatSpec,
): string {
  mkdirSync(WORK_DIR, { recursive: true });
  const assetStem = path.basename(plan.publicId);
  const rawPath = path.join(WORK_DIR, `${assetStem}-raw.${format.extension}`);
  const finalPath = path.join(
    WORK_DIR,
    `${assetStem}-${plan.target.width}x${plan.target.height}.${format.extension}`,
  );
  writeFileSync(rawPath, imageBuffer);

  try {
    // sips crops from the centre: -c <height> <width>.
    execFileSync("sips", [
      "-c",
      String(plan.target.height),
      String(plan.target.width),
      rawPath,
      "--out",
      finalPath,
    ]);
  } catch (error) {
    throw new BlogImageError(
      "The crop step failed. sips is the macOS image tool this generator depends on: " +
        (error instanceof Error ? error.message : String(error)),
    );
  } finally {
    rmSync(rawPath, { force: true });
  }

  const dimensions: { Width?: number; Height?: number } = {};
  const sipsOutput = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", finalPath], {
    encoding: "utf8",
  });
  for (const line of sipsOutput.split("\n")) {
    const match = line.match(/pixel(Width|Height): (\d+)/);
    if (match) dimensions[match[1] as "Width" | "Height"] = Number(match[2]);
  }

  if (dimensions.Width !== plan.target.width || dimensions.Height !== plan.target.height) {
    fail(
      `Unexpected final dimensions ${dimensions.Width}x${dimensions.Height}; ` +
        `expected ${plan.target.width}x${plan.target.height}.`,
    );
  }
  return finalPath;
}

/**
 * Uploads with a signed Cloudinary request. The signature covers every
 * parameter sent except file, api_key and resource_type: sorted alphabetically,
 * joined as key=value pairs, with the API secret appended, hashed with SHA-1.
 */
async function uploadToCloudinary(
  finalPath: string,
  plan: BlogImagePlan,
  format: FormatSpec,
  credentials: NodeJS.ProcessEnv,
  signal: AbortSignal | undefined,
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureParams: Record<string, string> = {
    invalidate: "true",
    public_id: plan.publicId,
    timestamp,
  };
  const toSign = Object.keys(signatureParams)
    .sort()
    .map((key) => `${key}=${signatureParams[key]}`)
    .join("&");
  const signature = createHash("sha1")
    .update(`${toSign}${credentials.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  const assetStem = path.basename(plan.publicId);
  const form = new FormData();
  form.append(
    "file",
    new Blob([readFileSync(finalPath)], { type: format.mime }),
    `${assetStem}.${format.extension}`,
  );
  form.append("api_key", credentials.CLOUDINARY_API_KEY as string);
  form.append("invalidate", "true");
  form.append("public_id", plan.publicId);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${credentials.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form, signal },
  );

  if (!response.ok) {
    throw new BlogImageError(describeErrorBody(response.status, await response.text()));
  }

  const payload = (await response.json()) as { secure_url?: string };
  if (!payload.secure_url) {
    throw new BlogImageError(
      "The Cloudinary response contained no secure_url: " +
        JSON.stringify(payload).slice(0, 2000),
    );
  }
  return payload.secure_url;
}

export async function generateBlogImage(
  request: BlogImageRequest,
  options: GenerateOptions,
): Promise<BlogImageOutcome> {
  const plan = planRequest(request, options.startDir);

  if (plan.dryRun) {
    return { status: "dry-run", plan };
  }

  const credentials = resolveCredentials(plan.projectRoot, options.env ?? process.env);
  if (!credentials.CLOUDINARY_API_KEY || !credentials.CLOUDINARY_CLOUD_NAME) {
    fail("Cloudinary credentials are incomplete.");
  }

  const format = FORMATS[request.format ?? "jpeg"];
  const imageBuffer = await generateWithOpenAI(request, plan, credentials, options.signal);
  const finalPath = cropToExactSize(imageBuffer, plan, format);
  const url = await uploadToCloudinary(finalPath, plan, format, credentials, options.signal);

  return {
    status: "success",
    plan,
    url,
    width: plan.target.width,
    height: plan.target.height,
    markdown: `![${request.alt}](${url})`,
  };
}
