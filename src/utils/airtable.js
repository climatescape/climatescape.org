import { stringCompare } from "./string"
import { makeSlug } from "./slug"

function getLogo(Logo, LinkedinProfile) {
  const logo = Logo || LinkedinProfile?.[0]?.data.Logo
  const logoSharp = logo?.localFiles?.[0]?.childImageSharp
  return logoSharp?.resize || logoSharp?.fuild || logoSharp?.fixed
}

function getDescription(description) {
  const offset = 30
  const index = description?.slice(offset).search(/\./) ?? -1
  return index === -1 ? description : description.substr(0, index + offset + 1)
}

function transformCategory(data) {
  if (!data || !data.data) {
    return undefined
  }

  const {
    id,
    data: { Name, Count, Cover, Parent },
  } = data
  const parent = transformCategory(Parent?.[0])
  const cover = Cover?.localFiles?.[0]?.childImageSharp

  return {
    id,
    name: Name,
    fullName: parent ? [parent.name, Name].join(" > ") : Name,
    count: Count,
    cover: cover?.fluid || cover?.resize,
    slug: `/categories/${makeSlug(Name)}`,
    parent,
  }
}

export function transformCategories(data) {
  const categories = (data.categories?.nodes || [])
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

// Accepts a `raw` organization from GraphQL, cleans up the key formatting and
// simplifies data structures.
// Optionally accepts a `userTransform` function to further modify the `out`
// value with `raw` data before returning
export function transformOrganization(raw, userTransform = (_, out) => out) {
  const {
    id,
    data: {
      Name,
      About,
      Homepage,
      HQ_Location: HQLocation,
      Tagline,
      Logo,
      LinkedIn,
      LinkedIn_Profiles: LinkedinProfile,
      Headcount,
      Organization_Type: OrganizationType,
      Categories,
      Twitter,
      Capital_Profile: CapitalProfile,
      Photos,
    },
  } = raw

  return userTransform(raw, {
    id,
    title: Name,
    description: getDescription(Tagline || About),
    tagline: Tagline,
    about: (About || "").replace(Tagline, ""),
    location: HQLocation,
    headcount: Headcount,
    orgType: OrganizationType,
    slug: `/organizations/${makeSlug(Name)}`,
    homepage: Homepage,
    linkedIn: LinkedIn,
    twitter: Twitter,
    logo: getLogo(Logo, LinkedinProfile),
    categories: Categories?.map(transformCategory) ?? [],
    capitalProfile: CapitalProfile?.map(({ data }) => ({
      type: data.Type,
      strategic: data.Strategic,
      stage: data.Stage,
      checkSize: data.CheckSize,
    }))?.[0],
    photos:
      Photos?.localFiles
        ?.map(i => i.childImageSharp)
        .map(i => i.resize || i.fixed || i.fluid) || [],
    thumbnails: transformThumbnails(Photos),
  })
}

export function transformOrganizations(orgs) {
  const organizations = orgs
    .map(org => transformOrganization(org))
    .sort((a, b) => stringCompare(a.title, b.title))

  if (typeof window === "object") {
    // eslint-disable-next-line no-restricted-globals
    window.organizations = organizations
    // eslint-disable-next-line no-console
    console.log({ organizations })
  }
  return organizations
}
