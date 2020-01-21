import React from "react"
import { graphql } from 'gatsby'

import { stringCompare } from "../utils/string"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import OrganizationFilter, {useOrganizationFilterState} from "../components/OrganizationFilter"
import SEO from "../components/seo"

const SectorTemplate = ({ data }) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState();

  const name = data.airtable.data.Name

  function filterDuplicateAndEmptyItems(...items) {
    return [...new Set(items)].filter(m=>m);
  }

  // Avoid breaking if the sector has no orgs + map out nested data object
  let organizations = (data.airtable.data.Organizations || [])
    .map(o => o.data)
    .map(({ Name, About, Tags, Homepage, City, State_Province, Country, Tagline, Logo, Headcount, Organization_Type }) => ({
      title: Name,
      description: Tagline || About,
      tags: Tags,
      location: filterDuplicateAndEmptyItems(City, State_Province, Country).join(', '),
      headcount: Headcount,
      orgType: Organization_Type,
      homepage: Homepage,
      logo: Logo && Logo.localFiles[0] && Logo.localFiles[0].childImageSharp && Logo.localFiles[0].childImageSharp.fixed,
    }));

  // Sort by name (ascending)
  organizations = applyFilter(organizations).sort((a, b) => stringCompare(a.title, b.title))

  return <Layout contentClassName="bg-gray-200">
    <SEO title={`${name} organizations on Climatescape`} />

    <div className="max-w-4xl mx-auto pb-4">
      <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">
        {name} organizations
      </h2>

      <OrganizationFilter
        currentFilter={filter}
        onClearFilter={() => setFilter.none()} />

      <div className="bg-white">
        {
          organizations.map((org, index) =>
            <OrganizationCard
              title={org.title}
              description={org.description}
              tags={org.tags}
              location={org.location}
              headcount={org.headcount}
              orgType={org.orgType}
              homepage={org.homepage}
              logo={org.logo}
              key={index}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          )
        }
      </div>
    </div>
  </Layout>
}

export const query = graphql`
  query SectorPageQuery($slug: String) {
    airtable(table: { eq: "Sectors" }, data: { Slug: { eq: $slug } }) {
      data {
        Name
        Organizations {
          data {
            Name
            Homepage
            About
            Slug
            Tags,
            Tagline,
            City,
            State_Province,
            Country,
            Organization_Type,
            Headcount,
            Logo {
              localFiles {
                childImageSharp {
                  fixed(width: 64, height: 64, fit: CONTAIN, background: "white") {
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
`

export default SectorTemplate
