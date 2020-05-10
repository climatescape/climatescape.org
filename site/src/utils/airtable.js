import compact from "lodash/compact"

import { stringCompare } from "./string"
import { makeSlug } from "./slug"

function getLogo(Logo, LinkedinProfile, Crunchbase) {
  const logo =
    Logo || LinkedinProfile?.[0]?.data.Logo || Crunchbase?.[0]?.data.Logo
  const logoSharp = logo?.localFiles?.[0]?.childImageSharp
  return logoSharp?.resize || logoSharp?.fuild || logoSharp?.fixed
}

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

function transformThumbnails(Photos) {
  return Photos?.internal
    ? JSON.parse(Photos.internal.content).map(
        internal => internal.thumbnails?.large
      )
    : []
}

const DescriptionRegexp = /([^.]{2}\.)(?:\s|$)/
const DescriptionThreshold = 180

function truncateDescription(string) {
  if (!string) return null

  // If the string is below the threshold, use it
  if (string.length <= DescriptionThreshold) return string

  // If the first sentences is below the threshold, use it
  const sentencePieces = string.split(DescriptionRegexp, 2)
  const sentence = sentencePieces.length === 2 && sentencePieces.join("")

  if (sentence && sentence.length <= DescriptionThreshold) return sentence

  // Otherwise truncate the full string and add an ellipsis
  return `${string.substring(0, DescriptionThreshold)}…`
}

// Accepts a `raw` organization from GraphQL, cleans up the key formatting and
// simplifies data structures.
// Optionally accepts a `userTransform` function to further modify the `out`
// value with `raw` data before returning
export function transformOrganization(raw, userTransform = (_, out) => out) {
  const {
    id,
    recordId,
    data: {
      Name,
      About,
      Homepage,
      HQ_Country: hqCountry,
      HQ_Region: hqRegion,
      HQ_Locality: hqLocality,
      Tagline,
      Logo,
      LinkedIn,
      LinkedIn_Profiles: LinkedinProfile,
      Headcount,
      Organization_Type: OrganizationType,
      Categories,
      Twitter,
      Capital_Profile: CapitalProfile,
      Crunchbase,
      Crunchbase_ODM: CrunchbaseODM,
      Facebook,
      Photos,
      Role,
      Source,
    },
  } = raw

  return userTransform(raw, {
    id,
    recordId,
    title: Name,
    description: truncateDescription(Tagline || About),
    tagline: Tagline,
    about: About || "",
    location: compact([hqLocality, hqRegion, hqCountry]).join(", "),
    hqLocation: (hqLocality || hqRegion || hqCountry) && {
      locality: hqLocality,
      region: hqRegion,
      country: hqCountry,
    },
    headcount: Headcount,
    orgType: OrganizationType,
    slug: `/organizations/${makeSlug(Name)}`,
    homepage: Homepage,
    linkedIn: LinkedIn,
    twitter: Twitter,
    crunchbase: Crunchbase,
    facebook: Facebook,
    logo: getLogo(Logo, LinkedinProfile, CrunchbaseODM),
    role: Role,
    source: Source?.map(source => ({
      name: source.data.Name,
      url: source.data.URL,
    }))?.[0],
    categories: Categories?.map(transformCategory) ?? [],
    capitalProfile: CapitalProfile?.map(({ data }) => ({
      type: data.CapitalType?.map(t => t.data?.Name),
      strategic: data.Strategic,
      stage: data.Stage,
      checkSize: data.CheckSize,
      impactSpecific: data.ImpactSpecific,
    }))?.[0],
    photos:
      Photos?.localFiles
        ?.map(i => i.childImageSharp)
        .map(i => i.resize || i.fixed || i.fluid) || [],
    thumbnails: transformThumbnails(Photos),
  })
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
