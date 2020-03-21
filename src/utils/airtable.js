import { makeSlug } from "./slug"
import { stringCompare } from "./string"

function getLogo(Logo, LinkedinProfile) {
  const rawLogo = Logo || LinkedinProfile?.[0]?.data.Logo
  const logo = rawLogo?.localFiles?.[0]?.childImageSharp?.fixed
  return logo
}

export function transformOrganizations({ organizations, sectors }) {
  sectors = sectors?.nodes.map(sector => sector.data)

  // Avoid breaking if the sector has no orgs + map out nested data object
  return (organizations?.nodes ?? [])
    .map(o => o.data)
    .map(
      ({
        Name,
        About,
        Tags,
        Homepage,
        HQ_Location: HQLocation,
        Tagline,
        Logo,
        Categories,
        LinkedIn_Profiles: LinkedinProfile,
        Headcount,
        Organization_Type: OrganizationType,
        Sector,
        Capital_Profile: CapitalProfile,
      }) => ({
        title: Name,
        description: Tagline || About,
        tags: Tags,
        categories: Categories?.map(c => c.data.Name),
        location: HQLocation,
        headcount: Headcount,
        orgType: OrganizationType,
        slug: makeSlug(Name),
        homepage: Homepage,
        logo: getLogo(Logo, LinkedinProfile),
        sector: sectors?.find(sector => sector.slug === Sector?.[0].data.Slug),
        capitalProfile: CapitalProfile?.map(({ data }) => ({
          type: data.Type,
          strategic: data.Strategic,
          stage: data.Stage,
          checkSize: data.CheckSize,
        }))?.[0],
      })
    )
    .sort((a, b) => stringCompare(a.title, b.title))
}
