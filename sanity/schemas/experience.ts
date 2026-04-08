import { defineField, defineType } from "sanity";

type ExperienceParent = {
  isCurrentJob?: boolean;
};

export const experienceSchema = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isCurrentJob",
      title: "Current Job",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      hidden: ({ parent }) => Boolean((parent as ExperienceParent | undefined)?.isCurrentJob),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as ExperienceParent | undefined;
          if (parent?.isCurrentJob) return true;
          return value
            ? true
            : "End date is required when this is not the current job.";
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "role",
      subtitle: "company",
      isCurrentJob: "isCurrentJob",
    },
    prepare(selection) {
      const { title, subtitle, isCurrentJob } = selection;
      return {
        title: title || "Untitled role",
        subtitle: `${subtitle || "Unknown company"}${isCurrentJob ? " - Current" : ""}`,
      };
    },
  },
});
