---
name: Blog Post
description: >
  Write or edit a blog post for jonathanfreire.com. Use it whenever a post is
  being created, drafted, translated, or revised under portfolio/posts/ — even
  when the user only says "write a post", "escribe un post", "draft a new
  article", or "add a cover". It loads the authoring rules in brand/BLOG.md and
  drives the workflow: scope, draft, humanizer pass, translation, images and
  verification.
---

# Blog Post

Authoring a post for jonathanfreire.com. This skill does not restate the rules;
it points at the source of truth and drives the order of work.

## Read first

All paths below are relative to the portfolio repo root (`portfolio/`), which is
the working directory for this project.

Before writing or editing anything under `posts/`, load:

- `../brand/BLOG.md` — the blog authoring system. **Source of truth**: file
  locations, frontmatter, structure, voice, SEO rules, image workflow and the
  pre-publish checklist. Everything below defers to it.
- `../brand/strategy.md` — the general voice, vocabulary and language rules
  that BLOG.md §8 applies to posts.

`BLOG.md` references the two benchmark posts in its §7. Read one English post
and its Spanish counterpart before writing a new one; they are the register to
match.

If a rule and a real post disagree, `BLOG.md` wins — except the reference
posts in §7, which are the benchmark: when one of them contradicts a rule, the
rule is the thing to fix, in `BLOG.md`, not in the draft.

## Workflow

Follow BLOG.md §6 in order. In short:

1. Scope the post with the user: topic, type (guide, news, opinion) and reader.
   Research and verify claims against primary sources when asked. Never invent
   facts, numbers, versions or quotes.
2. Write the English draft to `posts/en/<slug>.mdx`, following BLOG.md §2–§5.
   The slug is final at this point.
3. Run the `humanizer` skill over the finished prose, in embedded mode (it
   returns only the final text). Never touch code blocks, commands, paths or
   link targets. The reference posts carry no em or en dashes; keep it that way.
4. Show the English draft to the user. Translation starts only after approval.
5. Translate to `posts/es/<slug>.mdx`: natural Spanish, addressed as "tú", same
   structure, slug, date and tags. Follow the translation register in BLOG.md.
6. Generate the images with the `generate_image` tool (below).
7. Verify with `pnpm build`, then open `/blog/<slug>` and `/es/blog/<slug>`
   locally and check the hero, headings, code block titles and table of
   contents.

## Images

Use the project tool `generate_image`, not a shell script. It generates with
OpenAI `gpt-image-2.5-sunburst`, centre crops to an exact size, uploads to
Cloudinary under `portfolio/blog/` and returns the markdown line to paste.

- **Cover** — `size: "cover"` (1400x800). The first image of the body, right
  after the frontmatter, in both language files. One cover shared by both files;
  the cover carries no text unless the user asks for it. The alt text is the
  post title in the language of each file.
- **Figure** — `size: "inline"` (1400x900) plus `name` (`figure-3`,
  `architecture`) and `format: "png"` for diagrams and charts. Placed right
  after the paragraph it supports, in both files, alt text translated. One
  figure per idea; never stack figures.
- Never generate brand logos; use the official asset instead.

Read the alt text and prompt rules in BLOG.md §3 before calling the tool. The
tool reads credentials from `.env` at the portfolio root; if it reports missing
credentials, tell the user which variables to add and stop — do not create or
read that file.

## Checklist

BLOG.md §9 is the pre-publish checklist. Confirm every item before calling the
post done, including both language files, translated alt text, no banned
vocabulary and a passing `pnpm build`.
