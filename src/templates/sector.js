import React, { useState } from "react"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import Tag from "../components/Tag"

const SectorTemplate = ({ data }) => {
  const [tag, setTag] = useState(null)

  const name = data.airtable.data.Name

  // Avoid breaking if the sector has no orgs + map out nested data object
  let organizations = (data.airtable.data.Organizations || []).map(o => o.data)

  // Filter all organizations by tag if one is selected
  if (tag) organizations = organizations.filter(organization =>
    organization.Tags && organization.Tags.indexOf(tag) >= 0
  )

  return <Layout contentClassName="bg-gray-200">
    <div className="max-w-4xl mx-auto pb-4">
      <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">
        {name} Organizations
      </h2>

      { tag && <p className="p-3 text-gray-700 bg-gray-100 border-b border-gray-400 text-sm">
          <span className="mr-2">Filtered by</span>
          <Tag active={true}>{tag}</Tag>
          <button
            onClick={e => setTag(null)}
            className="underline hover:no-underline ml-1"
          >clear</button>
        </p>
      }

      <div className="bg-white">
        {
          organizations.map(({ Name, About, Tags, Homepage }, index) =>
            <OrganizationCard
              title={Name}
              description={About}
              tags={Tags}
              activeTag={tag}
              homepage={Homepage}
              key={index}
              onPickTag={tag => setTag(tag)}
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
            Tags
          }
        }
      }
    }
  }
`

export default SectorTemplate
