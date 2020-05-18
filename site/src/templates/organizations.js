import React, { useMemo } from "react"
import { graphql } from "gatsby"
import uniqBy from "lodash/uniqBy"
import { sortOrganizations } from "../utils/organizations"
import { transformCategories, transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import SEO from "../components/seo"
import CategoryList from "../components/CategoryList"
import { useFavorites, mergeFavorites } from "../utils/favorites"

function OrganizationsTemplate({
  data,
  pageContext: { categoryId, categoryName, categoryCounts },
}) {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()
  const favorites = useFavorites(data.climatescape)
  const { organizationAddFormUrl } = data.site.siteMetadata
  const categories = transformCategories(data.categories.nodes)

  // On first render, perform some data transformations on the raw Gatsby query
  const allOrgs = useMemo(() => {
    // Merge results from the primary/seconary queries into one array
    const rawOrgs = uniqBy(
      [...data.subOrganizations?.nodes, ...data.topOrganizations?.nodes],
      org => org.recordId
    )

    // Turn raw Airtable data into something we can work with
    const transformedOrgs = transformOrganizations(rawOrgs)

    // Add initial favorite counts from Hasura via Gatsby
    const favoritedOrgs = mergeFavorites(transformedOrgs, favorites)

    // Sort once using this data
    return sortOrganizations(favoritedOrgs)
  }, [data])

  const favoritedOrgs = mergeFavorites(allOrgs, favorites)
  const filteredOrgs = applyFilter(favoritedOrgs)

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
            organizations={filteredOrgs}
            allOrganizations={allOrgs}
            showFilters={["location", "role", "headcount", "orgType"]}
          />

          <div>
            {filteredOrgs.map(org => (
              <OrganizationCard
                organization={org}
                categoryId={categoryId}
                key={org.recordId}
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
    ...StaticFavorites
  }
`

export default OrganizationsTemplate
