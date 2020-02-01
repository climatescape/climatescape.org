import React from "react"
import { graphql } from 'gatsby'

import OrganizationCard from "../components/OrganizationCard"
import { filterDuplicateAndEmptyItems } from "../utils/array"

import Layout from "../components/layout"
import SEO from "../components/seo"

const OrganizationTemplate = ({ data }) => {

  const siteTitle = data.site.siteMetadata.title
  const organizationData = data.airtable.data

  const org = {
    title: organizationData.Name,
    description: organizationData.Tagline || organizationData.About,
    tags: organizationData.Tags,
    location: filterDuplicateAndEmptyItems(organizationData.City, organizationData.State_Province, organizationData.Country).join(', '),
    headcount: organizationData.Headcount,
    orgType: organizationData.Organization_Type,
    homepage: organizationData.Homepage,
    logo: organizationData.Logo && organizationData.Logo.localFiles[0] && organizationData.Logo.localFiles[0].childImageSharp
      && organizationData.Logo.localFiles[0].childImageSharp.fixed,
  }

  return <Layout contentClassName="bg-gray-200">
    <SEO title={`${org.title} is solving climate change - ${siteTitle}`} />

    <div className="max-w-4xl mx-auto pb-4">
      <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">
        {org.title}
      </h2>
      {/*WIP: we need to create a proper organization UI page */}
      <div className="bg-white">
        <OrganizationCard
          title={org.title}
          description={org.description}
          tags={org.tags}
          location={org.location}
          headcount={org.headcount}
          orgType={org.orgType}
          homepage={org.homepage}
          logo={org.logo}
        />
      </div>
    </div>
  </Layout>
}

export const query = graphql`
  query OrganizationPageQuery($slug: String) {
    site {
      siteMetadata {
        title
      }
    }

    airtable(table: { eq: "Organizations" }, data: { Slug: { eq: $slug } }) {
      data {
        Name
        Homepage
        About
        Tags
        Tagline
        City
        State_Province
        Country
        Organization_Type
        Headcount
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
`

export default OrganizationTemplate
