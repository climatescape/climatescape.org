const compact = require("lodash/compact")
const _ = require("lodash")
const { makeSlug } = require("./slug")

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

function getLogo(Logo, LinkedinProfile, Crunchbase) {
  const logo =
    Logo ||
    _.get(LinkedinProfile, "[0]data.Logo") ||
    _.get(Crunchbase, "[0]data.Logo")
  const logoSharp = _.get(logo, "localFiles[0].childImageSharp")
  return (
    _.get(logoSharp, "resize") ||
    _.get(logoSharp, "fuild") ||
    _.get(logoSharp, "fixed")
  )
}

function transformThumbnails(Photos) {
  return _.get(Photos, "internal")
    ? JSON.parse(Photos.internal.content).map(internal =>
        _.get(internal, "thumbnails.large")
      )
    : []
}

function transformCategory(category) {
  if (!_.get(category, "data")) return undefined

  const {
    id,
    data: { Name, Count, Cover, Parent },
  } = category
  const parent = transformCategory(_.get(Parent, "[0]"))
  const cover = _.get(Cover, "localFiles[0].childImageSharp")

  return {
    id,
    name: Name,
    fullName: compact([_.get(parent, "name"), Name]).join(" > "),
    count: Count,
    cover: _.get(cover, "fluid") || _.get(cover, "resize"),
    slug: `/categories/${makeSlug(Name)}`,
    parent,
  }
}

// Accepts a `raw` organization from GraphQL, cleans up the key formatting and
// simplifies data structures.
// Optionally accepts a `userTransform` function to further modify the `out`
// value with `raw` data before returning
function transformOrganization(raw, userTransform = (__, out) => out) {
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
  truncateDescription,
  getLogo,
  transformThumbnails,
  transformOrganization,
}
