import React from "react"
import { graphql } from "gatsby"
import { uniqBy } from "lodash"

import { transformCategories, transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import SEO from "../components/seo"
import CategoryList from "../components/CategoryList"

function OrganizationsTemplate({
  data,
  pageContext: { categoryId, categoryName, categoryCounts },
}) {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  // We need to combine organizations from the query for sub-categories
  // and top-categories which might include duplicate orgs.
  const orgs = uniqBy(
    [...data.subOrganizations?.nodes, ...data.topOrganizations?.nodes],
    org => org.data.Name
  )

  const allOrganizations = transformOrganizations(orgs)
  const organizations = applyFilter(allOrganizations)
  const categories = transformCategories(data.categories.nodes)

  const { organizationAddFormUrl } = data.site.siteMetadata

  return (
    <Layout contentClassName="bg-gray-100 px-3 sm:px-6">
      <SEO title={`${categoryName || "All"} organizations on Climatescape`} />

      <div className="flex flex-col mx-auto container lg:flex-row font-sans ">
        <CategoryList
          categories={categories}
          activeCategoryId={categoryId}
          categoryCounts={categoryCounts}
        />
        <div className="lg:w-3/5">
          <IndexHeader
            title={categoryName || "All Organizations"}
            buttonText="Add"
            buttonUrl={organizationAddFormUrl}
            filter={filter}
            onClearFilter={() => setFilter.none()}
            onApplyFilter={setFilter}
            organizations={organizations}
            allOrganizations={allOrganizations}
            showFilters={["location", "role", "headcount", "orgType"]}
          />

          <div>
            {organizations.map(org => (
              <OrganizationCard
                organization={org}
                categoryId={categoryId}
                key={org.title}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query OrganizationsPageQuery($categoryId: String) {
    site {
      siteMetadata {
        organizationAddFormUrl
      }
    }
    categories: allAirtable(filter: { table: { eq: "Categories" } }) {
      nodes {
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
    }
    topOrganizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Role: {
            in: [
              "Products & Services"
              "Research & Development"
              "Advocacy"
              "Network"
            ]
          }
          Categories: { elemMatch: { id: { eq: $categoryId } } }
        }
      }
    ) {
      nodes {
        ...OrganizationCard
      }
    }
    subOrganizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Role: {
            in: [
              "Products & Services"
              "Research & Development"
              "Advocacy"
              "Network"
            ]
          }
          Categories: {
            elemMatch: {
              data: { Parent: { elemMatch: { id: { eq: $categoryId } } } }
            }
          }
        }
      }
    ) {
      nodes {
        ...OrganizationCard
      }
    }
  }
`

export default OrganizationsTemplate
