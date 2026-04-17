import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";

import { dataset, projectId } from "@/sanity/lib/env";
import { schema } from "@/sanity/schemas";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to your environment variables.",
  );
}

export default defineConfig({
  name: "default",
  title: "Portfolio Studio",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool(), codeInput()],
  form: {
    components: {
      portableText: {
        plugins: (props) => {
          return props.renderDefault({
            ...props,
            plugins: {
              ...props.plugins,
              typography: {
                preset: "all",
              },
            },
          });
        },
      },
    },
  },
});
