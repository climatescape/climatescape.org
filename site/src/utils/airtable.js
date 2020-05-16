import compact from "lodash/compact"
import { stringCompare } from "./string"
import { makeSlug } from "./slug"
import { transformOrganization } from "./helpers"

export * from "./helpers"

function transformCategory(category) {
  if (!category?.data) return undefined

  const {
    id,
    data: { Name, Count, Cover, Parent },
  } = category
  const parent = transformCategory(Parent?.[0])
  const cover = Cover?.localFiles?.[0]?.childImageSharp

  return {
    id,
    name: Name,
    fullName: compact([parent?.name, Name]).join(" > "),
    count: Count,
    cover: cover?.fluid || cover?.resize,
    slug: `/categories/${makeSlug(Name)}`,
    parent,
  }
}

export function transformCategories(rawCategories) {
  const categories = rawCategories
    .map(transformCategory)
    .sort((a, b) => stringCompare(a.name, b.name))

  if (typeof window === "object") {
    // eslint-disable-next-line no-restricted-globals
    window.categories = categories
    // eslint-disable-next-line no-console
    console.log({ categories })
  }

  return categories
}

export function transformOrganizations(orgs, userTransform) {
  const organizations = orgs.map(org =>
    transformOrganization(org, userTransform)
  )

  if (typeof window === "object") {
    // eslint-disable-next-line no-restricted-globals
    window.organizations = organizations
    // eslint-disable-next-line no-console
    console.log({ organizations })
  }
  return organizations
}

export const transformCapitalTypes = capitalTypes =>
  capitalTypes.map(({ id, data: { Name, Cover, Slug } }) => ({
    id,
    name: Name,
    cover: Cover?.localFiles?.[0]?.childImageSharp?.fluid,
    slug: `/capital/${Slug}`,
  }))
