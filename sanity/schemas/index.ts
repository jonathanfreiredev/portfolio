import type { SchemaTypeDefinition } from "sanity"

import { postSchema } from "@/sanity/schemas/post"
import { projectSchema } from "@/sanity/schemas/project"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectSchema, postSchema],
}
