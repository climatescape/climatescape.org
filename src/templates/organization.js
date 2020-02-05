import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"

import { OrganizationTag, OrganizationLocation, OrganizationHeadcount, OrganizationOrgType } from "../components/OrganizationAttributes"
import OrganizationSocial from "../components/OrganizationSocial"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Section from "../components/Section"

import { filterDuplicateAndEmptyItems } from "../utils/array"

const OrganizationTemplate = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const orgData = data.airtable.data

  const sector = orgData.Sector[0]?.data || {}
  const org = {
    logo: orgData.Logo?.localFiles?.[0]?.childImageSharp?.fixed,
    title: orgData.Name,
    sector: {
      name: sector.Name,
      slug: sector.Slug,
    },
    tagline: orgData.Tagline,
    about: orgData.About && orgData.About.replace(orgData.Tagline, ""),
    location: filterDuplicateAndEmptyItems(orgData.City, orgData.State_Province, orgData.Country).join(", "),
    headcount: orgData.Headcount,
    orgType: orgData.Organization_Type,
    homepage: orgData.Homepage,
    linkedIn: orgData.LinkedIn,
    twitter: orgData.Twitter,
    tags: orgData.Tags,
  }

  return <Layout contentClassName="bg-gray-200">
    <SEO
      title={`${org.title} is solving climate change - ${siteTitle}`}
      description={`${org.title} is on ${siteTitle}. ${org.tagline}`}
    />

    <div className="max-w-4xl mx-auto pb-4">
      {org.logo &&
        <div className="p-3 mt-3 lg:my-6 text-center">
          <Img fixed={org.logo}/>
        </div>
      }
      <Section>
        <h2 className="text-3xl tracking-wide font-light">{org.title}</h2>
        {org.sector && <Link to={`/sectors/${org.sector.slug}`} className="block text-teal-700 hover:text-teal-900">{org.sector.name}</Link> }
        <h3 className="font-bold my-3 pl-3 lg:my-6 border-l-8 border-teal-500 border-solid">{org.tagline}</h3>
        {org.about && org.about !== org.tagline && <div className="py-3">{org.about}</div>}
        {org.location && <OrganizationLocation key="location" text={org.location}/>}
        {org.headcount && <OrganizationHeadcount key="headcount" text={org.headcount}/>}
        {org.orgType && <OrganizationOrgType key="orgtype" text={org.orgType}/>}
      </Section>
      <Section title="Social">
        <OrganizationSocial homepage={org.homepage} linkedIn={org.linkedIn} twitter={org.twitter}/>
      </Section>

      {org.tags &&
        <Section title="Tags">
          {org.tags.map(tag => <OrganizationTag key={tag} text={tag} />)}
        </Section>
      }
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
        Logo {
          localFiles {
            childImageSharp {
              fixed(width: 200, height: 200, fit: CONTAIN, background: "transparent") {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
        Name
        Sector {
          data {
            Name
            Slug
          }
        }
        Tagline
        About
        City
        State_Province
        Country
        Headcount
        Organization_Type
        Homepage
        LinkedIn
        Twitter
        Tags
      }
    }
  }
`

export default OrganizationTemplate
