import { sortBy } from "lodash"

import { extractNumeric } from "./number"

export const capitalStages = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
]

export const capitalTypes = [
  {
    name: "Venture Capital",
    slug: "venture-capital",
    image: "ventureCapital",
  },
  {
    name: "Accelerator",
    slug: "accelerator",
    image: "accelerator",
  },
  {
    name: "Project Finance",
    slug: "project-finance",
    image: "projectFinance",
  },
  {
    name: "Angel",
    slug: "angel",
    image: "angel",
  },
  {
    name: "Grant",
    slug: "grant",
    image: "grant",
  },
  {
    name: "Incubator",
    slug: "incubator",
    image: "incubator",
  },
  {
    name: "Prize",
    slug: "prize",
    image: "prize",
  },
]

export function summarizeCapitalStages(stages) {
  if (!stages) return null
  if (stages.length === 1) return stages[0]

  const ordered = sortBy(stages, stage => capitalStages.indexOf(stage))
  const start = ordered[0]
  const end = ordered[stages.length - 1]

  return `${start} – ${end}`
}

export function summarizeCapitalCheckSizes(checkSizes) {
  if (!checkSizes) return null
  if (checkSizes.length === 1) return checkSizes[0]

  const ordered = sortBy(checkSizes, size => extractNumeric(size))
  const start = ordered[0].split("-").shift()
  const end = ordered[ordered.length - 1].split("-").pop()

  return `${start}–${end}`
}
