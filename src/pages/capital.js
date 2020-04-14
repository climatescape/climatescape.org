import React from "react"
import { graphql } from "gatsby"
import flatMap from "lodash/flatMap"

import {
  transformOrganizations,
  transformCapitalTypes,
} from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import SEO from "../components/seo"
import CapitalFilters from "../components/capital/CapitalFilters"

const CapitalTemplate = ({
  data: {
    capitalTypes: { nodes: capitalTypeNodes },
    allOrganizations: allOrganizationData,
    activeType: activeTypeData,
    site,
  },
  pageContext: { activeTypeId },
}) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  const capitalTypes = transformCapitalTypes(capitalTypeNodes)
  const activeType = capitalTypes.find(({ id }) => id === activeTypeId)

  let organizationNodes

  if (activeTypeData) {
    const profiles = flatMap(activeTypeData.nodes, "data.Capital_Profiles")
    organizationNodes = flatMap(profiles, "data.Organization")
  } else if (allOrganizationData) {
    organizationNodes = allOrganizationData.nodes
  } else {
    // This should never really happen
    organizationNodes = []
  }

  const allOrganizations = transformOrganizations(organizationNodes)
  const organizations = applyFilter(allOrganizations)

  const { capitalAddFormUrl } = site.siteMetadata

  return (
    <Layout contentClassName="bg-gray-100 px-3 sm:px-6">
      <SEO
        title="Climate Capital on Climatescape"
        description="Find climate-friendly VCs, grants, project finance, and more on Climatescape"
      />
      <div className="flex flex-col mx-auto container lg:flex-row font-sans">
        <CapitalFilters
          capitalTypes={capitalTypes}
          activeType={activeType}
          currentFilter={filter}
          onApplyFilter={setFilter}
        />
        <div className="lg:w-3/5">
          <IndexHeader
            title={activeType?.name || "Climate Capital"}
            buttonText="Add"
            buttonUrl={capitalAddFormUrl}
            filter={filter}
            onClearFilter={() => setFilter.none()}
            onApplyFilter={setFilter}
            organizations={organizations}
            allOrganizations={allOrganizations}
            showFilters={[
              "capitalCheckSize",
              "category",
              "orgType",
              "capitalImpactSpecific",
              "capitalStrategic",
            ]}
          />

          <div>
            {organizations.map(organization => (
              <OrganizationCard
                key={organization.title}
                organization={organization}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query CapitalPageQuery($activeTypeId: String, $active: Boolean = false) {
    # If $active is true, we will fetch the Capital Type specified by
    # $activeTypeId and query through the associated Capital Profiles to fetch
    # the appropriate organizations
    activeType: allAirtable(
      filter: { table: { eq: "Capital Types" }, id: { eq: $activeTypeId } }
    ) @include(if: $active) {
      nodes {
        data {
          Capital_Profiles {
            data {
              Organization {
                ...CapitalOrganizationCard
              }
            }
          }
        }
      }
    }

    # If $active is false (default), we fetch all Capital organizations by Role
    allOrganizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: { Role: { eq: "Capital" } }
      }
    ) @skip(if: $active) {
      nodes {
        ...CapitalOrganizationCard
      }
    }

    capitalTypes: allAirtable(
      filter: { table: { eq: "Capital Types" } }
      sort: { fields: [data___Name], order: ASC }
    ) {
      nodes {
        id
        data {
          Name
          Slug
        }
      }
    }

    site {
      siteMetadata {
        capitalAddFormUrl
      }
    }
  }
`

export default CapitalTemplate
