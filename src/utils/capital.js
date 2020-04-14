import { sortBy } from "lodash"

import { extractNumeric } from "./number"

export const capitalStages = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
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
