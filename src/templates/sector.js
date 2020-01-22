import React, { useState } from "react"
import { graphql } from 'gatsby'

import { stringCompare } from "../utils/string"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import Tag from "../components/Tag"

const SectorTemplate = ({ data }) => {
  const [tagFilter, setTagFilter] = useState(null)

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
      logo: Logo && Logo.localFiles[0] && Logo.localFiles[0].childImageSharp && Logo.localFiles[0].childImageSharp.fluid,
    }));

  // Filter all organizations by tag if one is selected
  if (tagFilter) organizations = organizations.filter(organization =>
    organization.tags && organization.tags.indexOf(tagFilter) >= 0
  )

  // Sort by name (ascending)
  organizations = organizations.sort((a, b) => stringCompare(a.title, b.title))

  return <Layout contentClassName="bg-gray-200">
    <div className="max-w-4xl mx-auto pb-4">
      <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">
        {name} Organizations
      </h2>

      { tagFilter && <p className="p-3 text-gray-700 bg-gray-100 border-b border-gray-400 text-sm">
          <span className="mr-2">Filtered by</span>
          <Tag active={true}>{tagFilter}</Tag>
          <button
            onClick={e => setTagFilter(null)}
            className="underline hover:no-underline ml-1"
          >clear</button>
        </p>
      }

      <div className="bg-white">
        {
          organizations.map(({ title, description, tags, homepage, location, logo, headcount, orgType }, index) =>
            <OrganizationCard
              title={title}
              description={description}
              tags={tags}
              activeTag={tagFilter}
              location={location}
              headcount={headcount}
              orgType={orgType}
              homepage={homepage}
              logo={logo}
              key={index}
              onPickTag={tag => setTagFilter(tag)}
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
                  fluid(maxWidth: 500, grayscale: true) {
                    ...GatsbyImageSharpFluid
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
