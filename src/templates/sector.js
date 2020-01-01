import React from "react"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"

const SectorTemplate = ({ data }) => {

  const name = data.airtable.data.Name
  const organizations = (data.airtable.data.Organizations || []).map(o => o.data)

  return <Layout contentClassName="bg-gray-200">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">{name} Organizations</h2>

      <div className="bg-white">
        {
          organizations.map(({ Name, About, Tags, Homepage }, index) =>
            <OrganizationCard
              title={Name}
              description={About}
              tags={Tags}
              homepage={Homepage}
              key={index}
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
