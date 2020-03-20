import React from "react"
import { graphql } from "gatsby"

import { stringCompare } from "../utils/string"
import { makeSlug } from "../utils/slug"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import OrganizationFilter, {
  useOrganizationFilterState,
} from "../components/OrganizationFilter"
import AddOrganizationCTA from "../components/AddOrganizationCTA"
import SEO from "../components/seo"

function getLogo(Logo, LinkedinProfile) {
  const rawLogo = Logo || LinkedinProfile?.[0]?.data
  const logo = rawLogo?.localFiles?.[0]?.childImageSharp?.fixed
  return logo
}

const CapitalTemplate = ({ data, pageContext }) => {
  const sectors = data.sectors.nodes.map(sector => sector.data)
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  // Avoid breaking if the sector has no orgs + map out nested data object
  let organizations = (data.organizations.nodes || [])
    .map(o => o.data)
    .map(
      ({
        Name,
        About,
        Homepage,
        HQ_Location: HQLocation,
        Tagline,
        Logo,
        LinkedIn_Profiles: LinkedinProfile,
        Organization_Type: OrganizationType,
        Categories,
        Capital_Profile: CapitalProfile,
      }) => ({
        title: Name,
        description: Tagline || About,
        location: HQLocation,
        orgType: OrganizationType,
        slug: makeSlug(Name),
        homepage: Homepage,
        logo: getLogo(Logo, LinkedinProfile),
        tags: Categories && Categories.map(c => c.data.Name),
        capitalType: CapitalProfile && CapitalProfile[0]?.data.Type,
        capitalStrategic: CapitalProfile && CapitalProfile[0]?.data.Strategic,
        capitalStage: CapitalProfile && CapitalProfile[0]?.data.Stage,
        capitalCheckSize: CapitalProfile && CapitalProfile[0]?.data.Check_Size,
      })
    )

    console.log(organizations)

  // Sort by name (ascending)
  organizations = applyFilter(organizations).sort((a, b) =>
    stringCompare(a.title, b.title)
  )

  return (
    <Layout contentClassName="bg-gray-200">
      <SEO title="Climate Capital on Climatescape" description="Find climate-friendly VCs, grants, project finance, and more on Climatescape" />

      <div className="max-w-4xl mx-auto pb-4">
        <div className="flex items-center p-3 md:mt-4">
          <h2 className="text-3xl tracking-wide font-light flex-grow">
            Climate Capital
          </h2>
          <AddOrganizationCTA variant="simple" />
        </div>

        <OrganizationFilter
          currentFilter={filter}
          onClearFilter={() => setFilter.none()}
        />

        <div className="bg-white">
          {organizations.map(org => (
            <OrganizationCard
              title={org.title}
              description={org.description}
              location={org.location}
              orgType={org.orgType}
              slug={org.slug}
              homepage={org.homepage}
              logo={org.logo}
              key={org.title}
              tags={org.tags}
              capitalType={org.capitalType}
              capitalStrategic={org.capitalStrategic}
              capitalStage={org.capitalStage}
              capitalCheckSize={org.capitalCheckSize}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          ))}
        </div>
        <div className="bg-white mt-8 p-3 text-center border-b border-gray-400">
          <AddOrganizationCTA />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query CapitalPageQuery {
    organizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Role: { eq: "Capital" }
        }
      }
    ) {
      nodes {
        data {
          Name
          Homepage
          About
          Tagline
          HQ_Location
          Organization_Type
          Logo {
            localFiles {
              childImageSharp {
                fixed(
                  width: 64
                  height: 64
                  fit: CONTAIN
                  background: "white"
                ) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          Categories {
            data {
              Name
            }
          }
          Capital_Profile {
            data {
              Type
              Strategic
              Stage
              Check_Size
            }
          }
          LinkedIn_Profiles {
            data {
              Logo {
                localFiles {
                  childImageSharp {
                    fixed(
                      width: 64
                      height: 64
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

export default CapitalTemplate
