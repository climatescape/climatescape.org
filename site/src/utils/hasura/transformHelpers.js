const compact = require("lodash/compact")

const { makeSlug } = require("../slug")

const DescriptionRegexp = /([^.]{2}\.)(?:\s|$)/
const DescriptionThreshold = 180

// Gatsby doesn't transpile with Babel, so the optional chaining syntax that
// we use in utils/airtable.js does not work.
// Example of optional chaining:
//   obj?.a?.b
// These functions are rewritten below without optional chaining.

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

function getLogo(Logo, LinkedinProfile, Crunchbase) {
  let crunchbaseLogo
  let linkedinLogo
  let logoSharp

  if (Crunchbase && Crunchbase[0] && Crunchbase[0].data)
    crunchbaseLogo = Crunchbase[0].data.Logo

  if (LinkedinProfile && LinkedinProfile[0] && LinkedinProfile[0].data)
    linkedinLogo = LinkedinProfile[0].data.Logo

  const logo = Logo || linkedinLogo || crunchbaseLogo

  if (
    logo &&
    logo.localFiles &&
    logo.localFiles[0] &&
    logo.localFiles[0].childImageSharp
  )
    logoSharp = logo.localFiles[0].childImageSharp

  if (logoSharp) return logoSharp.resize || logoSharp.fuild || logoSharp.fixed
  return null
}

function transformThumbnails(Photos) {
  if (Photos && Photos.internal) {
    return JSON.parse(Photos.internal.content).map(internal => {
      if (internal && internal.thumbnails) {
        return internal.thumbnails.large
      }
      return null
    })
  }

  return []
}

function transformCategory(category) {
  if (!category || (category && !category.data)) return undefined

  const {
    id,
    data: { Name, Count, Cover, Parent },
  } = category
  const parent = transformCategory(Parent ? Parent[0] : null)
  let cover
  if (Cover && Cover.localFiles && Cover.localFiles[0])
    cover = Cover.localFiles[0].childImageSharp

  return {
    id,
    name: Name,
    fullName: compact([parent ? parent.name : null, Name]).join(" > "),
    count: Count,
    cover: cover ? cover.fluid || cover.resize : null,
    slug: `/categories/${makeSlug(Name)}`,
    parent,
  }
}

function transformOrganization(raw, userTransform = (_, out) => out) {
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
    about: About || null,
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
    source: Source
      ? [...Source].map(source => ({
          name: source.data.Name,
          url: source.data.URL,
        }))[0]
      : null,
    categories: Categories ? Categories.map(transformCategory) : [],
    capitalProfile: CapitalProfile
      ? [...CapitalProfile].map(({ data }) => ({
          type: data.CapitalType
            ? data.CapitalType.map(t => {
                if (t.data) return t.data.Name
                return null
              })
            : null,
          strategic: data.Strategic,
          stage: data.Stage,
          checkSize: data.CheckSize,
          impactSpecific: data.ImpactSpecific,
        }))[0]
      : null,
    photos:
      Photos && Photos.localFiles
        ? Photos.localFiles
            .map(i => i.childImageSharp)
            .map(i => i.resize || i.fixed || i.fluid)
        : [],
    thumbnails: transformThumbnails(Photos),
  })
}

module.exports = {
  transformOrganization,
}
