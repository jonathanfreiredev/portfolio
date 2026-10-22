/**
 * Project plugin: the blog image generator tool for the portfolio.
 *
 * Registers `generate_image`, which turns an image concept into a finished
 * Cloudinary asset and returns the markdown line to paste into the post. The
 * heavy lifting lives in `generate.ts`; this file only wires it to OpenCode.
 *
 * Credentials are read from `portfolio/.env` (see `.env.example` in this
 * folder). The tool is scoped to this project: it is only registered while the
 * portfolio's plugins are loaded, and the generator refuses to run outside the
 * portfolio repo.
 */

import { Plugin } from "@opencode/plugin";

import { generateBlogImage, BlogImageError, type BlogImageRequest } from "./generate.ts";

const TOOL_NAME = "generate_image";

const TOOL_DESCRIPTION = [
  "Generate a blog post image for jonathanfreire.com: the cover (hero) or an in-post figure.",
  "It calls OpenAI gpt-image-2.5-sunburst, centre crops the result to an exact size with sips,",
  "uploads it to Cloudinary under portfolio/blog/ and returns the markdown line to paste.",
  "Use size 'cover' (1400x800) for the hero, or 'inline' (1400x900) plus a 'name' suffix",
  "(for example 'figure-3') for a figure inside the article. Set dryRun to validate the plan",
  "without spending an API call. Credentials come from portfolio/.env.",
].join(" ");

const INPUT_SCHEMA = {
  type: "object",
  properties: {
    slug: {
      type: "string",
      description: "Post slug, lowercase kebab-case, identical to the post filename.",
    },
    prompt: {
      type: "string",
      description:
        "What the image should show, in English. Concrete subject and composition. For diagrams, spell the exact label wording.",
    },
    alt: {
      type: "string",
      description:
        "Markdown alt text. For a cover this is the post title; for a figure, a full sentence describing what it shows.",
    },
    name: {
      type: "string",
      description:
        "Suffix for an in-post figure ('figure-3', 'architecture'). Omit it for a cover.",
    },
    size: {
      type: "string",
      description: "'cover' (1400x800), 'inline' (1400x900) or an explicit WxH such as '1200x1200'.",
    },
    format: {
      type: "string",
      enum: ["jpeg", "png", "webp"],
      description: "Output format. Use png for diagrams and charts with text. Default jpeg.",
    },
    quality: {
      type: "string",
      enum: ["low", "medium", "high", "xhigh", "max", "auto"],
      description: "Image quality. Default medium.",
    },
    model: {
      type: "string",
      description: "Override the image model. Default gpt-image-2.5-sunburst.",
    },
    dryRun: {
      type: "boolean",
      description:
        "Resolve and validate the plan without calling OpenAI or Cloudinary. Use it to check the asset path and sizes.",
    },
  },
  required: ["slug", "prompt", "alt"],
  additionalProperties: false,
} as const;

export default Plugin.define({
  id: "portfolio.generate-image",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
        name: TOOL_NAME,
        description: TOOL_DESCRIPTION,
        input: { ...INPUT_SCHEMA },
        execute: async (input, context) => {
          const request = input as BlogImageRequest;

          await context.progress({
            status: request.dryRun ? "planning" : "generating",
            slug: request.slug,
          });

          let outcome;
          try {
            outcome = await generateBlogImage(request, {
              startDir: ctx.location.directory,
              signal: context.signal,
            });
          } catch (error) {
            if (error instanceof BlogImageError) {
              throw new Error(`generate_image: ${error.message}`);
            }
            throw error;
          }

          if (outcome.status === "dry-run") {
            const { plan } = outcome;
            return {
              content:
                `Dry run: nothing generated or uploaded.\n` +
                `Project: ${plan.projectRoot}\n` +
                `Asset: ${plan.publicId}.${plan.extension}\n` +
                `Generate: ${plan.model} (quality ${plan.quality}, ` +
                `${plan.generation.width}x${plan.generation.height})\n` +
                `Final: ${plan.target.width}x${plan.target.height} (exact, centre crop)`,
              metadata: {
                status: "dry-run",
                publicId: plan.publicId,
                projectRoot: plan.projectRoot,
              },
            };
          }

          return {
            content:
              `Image ready: ${outcome.url}\n` +
              `Dimensions verified: ${outcome.width}x${outcome.height}\n` +
              `Paste this where it belongs ` +
              `(covers: first line of the body, after the frontmatter):\n` +
              outcome.markdown,
            metadata: {
              status: "success",
              url: outcome.url,
              publicId: outcome.plan.publicId,
              width: outcome.width,
              height: outcome.height,
              markdown: outcome.markdown,
            },
          };
        },
      });
    });
  },
});
