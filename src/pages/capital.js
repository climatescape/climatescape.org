import React from "react"
import { graphql } from "gatsby"

import { transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import SEO from "../components/seo"
import CapitalFilters from "../components/capital/CapitalFilters"

const CapitalTemplate = ({
  data: {
    organizations: { nodes },
    site,
  },
  pageContext,
}) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  console.log(filter)

  let organizations = transformOrganizations(nodes)
  organizations = applyFilter(organizations)

  const { capitalAddFormUrl } = site.siteMetadata

  return (
    <Layout contentClassName="bg-gray-100 px-3 sm:px-6">
      <SEO
        title="Climate Capital on Climatescape"
        description="Find climate-friendly VCs, grants, project finance, and more on Climatescape"
      />
      <div className="flex flex-col mx-auto container lg:flex-row font-sans ">
        <CapitalFilters
          pageContext={pageContext}
          currentFilter={filter}
          onApplyFilter={setFilter}
        />
        <div className="lg:w-3/5">
          <IndexHeader
            title={pageContext.capitalType || "Climate Capital"}
            buttonText="Add"
            buttonUrl={capitalAddFormUrl}
            filter={filter}
            onClearFilter={() => setFilter.none()}
            onApplyFilter={setFilter}
            organizations={organizations}
            showFilters={["capitalCheckSize", "capitalImpactSpecific", "capitalStrategic", "category", "orgType"]}
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
  query CapitalPageQuery($capitalType: String) {
    organizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Role: { eq: "Capital" }
          Capital_Profile: {
            elemMatch: { data: { Type: { eq: $capitalType } } }
          }
        }
      }
    ) {
      nodes {
        ...CapitalOrganizationCard
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
