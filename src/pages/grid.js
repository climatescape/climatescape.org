import React from "react"
import { graphql } from "gatsby"

import { stringCompare } from "../utils/string"
import { makeSlug } from "../utils/slug"
import Masonry from "react-masonry-css"

import Layout from "../components/layout"
import OrganizationCard2 from "../components/OrganizationCard2"
import OrganizationFilter, {
  useOrganizationFilterState,
} from "../components/OrganizationFilter"
import AddOrganizationCTA from "../components/AddOrganizationCTA"
import SEO from "../components/seo"

import "./grid.css"

function getLogo(Logo, LinkedinProfile) {
  const rawLogo = Logo || LinkedinProfile?.[0]?.data
  const logo = rawLogo?.localFiles?.[0]?.childImageSharp?.fixed
  return logo
}

const OrganizationsTemplate = ({ data, pageContext }) => {
  const sectors = data.sectors.nodes.map(sector => sector.data)
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  // Avoid breaking if the sector has no orgs + map out nested data object
  let organizations = (data.organizations.nodes || [])
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
        LinkedIn_Profiles: LinkedinProfile,
        Headcount,
        Photos,
        Organization_Type: OrganizationType,
        Sector,
      }) => ({
        title: Name,
        description: Tagline || About,
        tags: Tags,
        location: HQLocation,
        headcount: Headcount,
        photos: Photos,
        orgType: OrganizationType,
        slug: makeSlug(Name),
        homepage: Homepage,
        logo: getLogo(Logo, LinkedinProfile),
        sector: sectors.find(sector => sector.slug === Sector?.[0]?.data?.Slug),
      })
    )

  // Sort by name (ascending)
  organizations = applyFilter(organizations)
    .filter(org => org.photos && org.photos.length >= 1)
    .filter(org => org.description)
    .filter(org => org.sector)

    // .slice(0, 100)
    .sort((a, b) => stringCompare(a.title, b.title))

  const organizationsTitle =
    filter.bySector || pageContext.sectorName
      ? filter.bySector?.name || pageContext.sectorName
      : "All"

  const bps = {
    default: 5,
    1800: 5,
    1500: 4,
    1240: 3,
    900: 2,
    700: 1,
  }

  return (
    <Layout contentClassName="organizations-grid bg-teal-500">
      <SEO title={`${organizationsTitle} organizations on Climatescape`} />

      <div className="organizations-container">
        {/* <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">
          {organizationsTitle} organizations{" "}
          <AddOrganizationCTA variant="simple" />
        </h2>

        <OrganizationFilter
          currentFilter={filter}
          onClearFilter={() => setFilter.none()}
        /> */}

        {/* <div className="organizations">
        
         */}

        <div className="header-bar"></div>
        <Masonry
          breakpointCols={bps}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {organizations.map(org => (
            <OrganizationCard2
              title={org.title}
              description={org.description}
              tags={org.tags}
              location={org.location}
              headcount={org.headcount}
              orgType={org.orgType}
              slug={org.slug}
              homepage={org.homepage}
              logo={org.logo}
              photos={org.photos}
              sector={org.sector}
              showSector={!pageContext.sectorName}
              key={org.title}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          ))}
        </Masonry>
        {/* </div> */}
        <div className="bg-white mt-8 p-3 text-center border-b border-gray-400">
          <AddOrganizationCTA />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query OrganizationsPageGridQuery($slugRegex: String) {
    organizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Sector: { elemMatch: { data: { Slug: { regex: $slugRegex } } } }
        }
      }
    ) {
      nodes {
        data {
          Name
          Homepage
          About
          Tags
          Tagline
          HQ_Location
          Organization_Type
          Headcount
          Photos {
            url
          }
          Logo {
            localFiles {
              childImageSharp {
                fixed(
                  width: 20
                  height: 20
                  fit: CONTAIN
                  background: "white"
                ) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          LinkedIn_Profiles {
            data {
              Logo {
                localFiles {
                  childImageSharp {
                    fixed(
                      width: 20
                      height: 20
                      fit: CONTAIN
                      background: "white"
                    ) {
                      ...GatsbyImageSharpFixed
                    }
                  }
                }
              }
            }
          }
          Sector {
            data {
              Slug
            }
          }
        }
      }
    }
    sectors: allAirtable(filter: { table: { eq: "Sectors" } }) {
      nodes {
        data {
          name: Name
          slug: Slug
        }
      }
    }
  }
`

export default OrganizationsTemplate
