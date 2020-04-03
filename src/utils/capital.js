import { makeSlug } from "./slug"

export const capitalStages = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
]

export const capitalTypes = [
  { name: "Venture Capital" },
  { name: "Project Finance" },
  { name: "Private Equity" },
  { name: "Incubator" },
  { name: "Accelerator" },
  { name: "Grant" },
  { name: "Prize" },
  { name: "Angel" },
].map(type => ({ ...type, slug: makeSlug(type.name) }))
