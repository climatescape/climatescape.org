import { stringCompare } from "./string"
import { makeSlug } from "./slug"

function getLogo(Logo, LinkedinProfile) {
  const logo = Logo || LinkedinProfile?.[0]?.data.Logo
  return logo?.localFiles?.[0]?.childImageSharp?.fixed
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

  return {
    id,
    name: Name,
    fullName: parent ? [parent.name, Name].join(" > ") : Name,
    count: Count,
    cover: Cover?.localFiles?.[0]?.childImageSharp?.fluid,
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
        internal => internal.thumbnails.large
      )
    : []
}

export function transformOrganization({
  id,
  data: {
    Name,
    About,
    Tags,
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
}) {
  return {
    id,
    title: Name,
    description: Tagline || About,
    tagline: Tagline,
    about: (About || "").replace(Tagline, ""),
    tags: Tags,
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
      Photos?.localFiles?.map(
        img => img.childImageSharp.fixed || img.childImageSharp.fluid
      ) ?? [],
    thumbnails: transformThumbnails(Photos),
  }
}

export function transformOrganizations(orgs) {
  const organizations = orgs
    .map(transformOrganization)
    .sort((a, b) => stringCompare(a.title, b.title))

  if (typeof window === "object") {
    // eslint-disable-next-line no-restricted-globals
    window.organizations = organizations
    // eslint-disable-next-line no-console
    console.log({ organizations })
  }
  return organizations
}
