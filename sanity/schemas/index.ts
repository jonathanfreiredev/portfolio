import type { SchemaTypeDefinition } from "sanity"

import { experienceSchema } from "@/sanity/schemas/experience"
import { postSchema } from "@/sanity/schemas/post"
import { projectSchema } from "@/sanity/schemas/project"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectSchema, postSchema, experienceSchema],
}
