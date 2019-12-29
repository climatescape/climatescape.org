import React from "react"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"

const SectorTemplate = ({ data }) => {

  const name = data.airtable.data.Name
  const organizations = data.airtable.data.Organizations.map(o => o.data)

  console.log(organizations)

  return <Layout>
    <div className="flex flex-wrap bg-gray-200">
      {
        organizations.map(({ Logo, Name, About }) =>
          <OrganizationCard
            title={Name}
            description={About}
            img={Logo && Logo.localFiles[0].childImageSharp}
          />
        )
      }
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
            Logo {
              localFiles {
                childImageSharp {
                  fluid {
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
