import React from "react"
import { graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import { transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import OrganizationFilter, {
  useOrganizationFilterState,
} from "../components/OrganizationFilter"
import SEO from "../components/seo"

const CapitalTemplate = ({
  data: {
    organizations: { nodes },
    site,
  },
}) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  let organizations = transformOrganizations(nodes)
  organizations = applyFilter(organizations)

  return (
    <Layout contentClassName="bg-gray-200">
      <SEO
        title="Climate Capital on Climatescape"
        description="Find climate-friendly VCs, grants, project finance, and more on Climatescape"
      />

      <div className="max-w-4xl mx-auto pb-4">
        <div className="flex items-center p-3 md:mt-4">
          <h2 className="text-3xl tracking-wide font-light flex-grow">
            Climate Capital
          </h2>
          <a
            href={site.siteMetadata.capitalFormUrl}
            className="px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:border-transparent hover:text-white hover:bg-teal-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit
          </a>
        </div>

        <OrganizationFilter
          currentFilter={filter}
          onClearFilter={() => setFilter.none()}
        />

        <div className="bg-white">
          {organizations.map(organization => (
            <OrganizationCard
              key={organization.title}
              organization={organization}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          ))}
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
        data: { Role: { eq: "Capital" } }
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
            id
            data {
              Name
              Parent {
                id
                data {
                  Name
                }
              }
            }
          }
          Capital_Profile {
            data {
              Type
              Strategic
              Stage
              CheckSize: Check_Size
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
    site {
      siteMetadata {
        capitalFormUrl
      }
    }
  }
`

export default CapitalTemplate
