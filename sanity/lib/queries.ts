import { groq } from "next-sanity"

export const projectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    description,
    image,
    url,
    techStack
  }
`

export const postsQuery = groq`
  *[_type == "post"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    image,
    "excerpt": coalesce(pt::text(body), "")
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    image,
    body
  }
`

export const experiencesQuery = groq`
  *[_type == "experience"] | order(startDate desc) {
    _id,
    company,
    role,
    location,
    isCurrentJob,
    startDate,
    endDate,
    description,
    skills
  }
`
