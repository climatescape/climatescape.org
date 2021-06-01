import React from "react"
import classnames from "classnames"

import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ContributorCard from "../components/ContributorCard"

const Header = ({ children, className = {} }) => (
  <h2
    className={classnames(
      "text-gray-900 text-2xl md:text-3xl font-light mt-6 mb-2",
      className
    )}
  >
    {children}
  </h2>
)

const TextLink = ({ href, children, newWindow = false, className }) => {
  const newWindowArgs = newWindow
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {}

  return (
    <a
      className={classnames(
        "underline hover:no-underline text-blue-600",
        className
      )}
      href={href}
      {...newWindowArgs}
    >
      {children}
    </a>
  )
}

const P = ({ children }) => <p className="my-2">{children}</p>

export default function ContributePage({ data }) {
  const people = data.contributors.nodes
    .sort((a, b) => a.data.Join_Date > b.data.Join_Date)
    .map(({ data: { Name, Avatar, Contributions, Website, Type } }) => ({
      name: Name,
      avatar: Avatar?.localFiles[0]?.childImageSharp.fluid,
      contributions: Contributions,
      website: Website,
      type: Type,
    }))

  const contributors = people.filter(p => p.type === "Community Contributor")
  const team = people.filter(p => p.type === "Team")

  const {
    organizationAddFormUrl,
    capitalAddFormUrl,
    contributorFormUrl,
  } = data.site.siteMetadata

  return (
    <Layout contentClassName="bg-gray-100">
      <SEO
        title="About Climatescape"
        description="Our mission is to accelerate the transition to a sustainable global economy by supporting organizations which have a positive impact on people and the planet."
      />

      <div className="flex flex-col mx-auto container max-w-xl pb-20 px-4">
        <div>
          <Header>About Climatescape</Header>
          <P>
            Our mission is to accelerate the transition to a sustainable global
            economy by supporting organizations which have a positive impact on
            people and the planet. Our open directory includes thousands of
            companies, investors, NGOs, and other organizations that support
            climate solutions.
          </P>
          <P>
            <TextLink href="https://dash.climatescape.org/?ref=OrgAbout">
              Climatescape Dash
            </TextLink>{" "}
            is our upcoming platform to help professionals track the development
            and commercialization of innovative climate solutions.
          </P>

          <Header>Our Team</Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {team.map(member => (
              <ContributorCard
                key={member.name}
                avatar={member.avatar}
                website={member.website}
                name={member.name}
                contributions={member.contributions}
              />
            ))}
          </div>
          <Header>Submit an Organization</Header>
          <P>
            We welcome you to add new submissions to the website using the forms
            below:
          </P>
          <ul className="list-disc list-outside ml-5">
            <li>
              <P>
                <TextLink newWindow href={organizationAddFormUrl}>
                  Companies
                </TextLink>{" "}
                — Startups and larger companies working on innovative solutions
                to climate change.
              </P>
            </li>
            <li>
              <P>
                <TextLink newWindow href={capitalAddFormUrl}>
                  Capital &amp; Catalysts
                </TextLink>{" "}
                — Investors, accelerators, and fellowships.
              </P>
            </li>
          </ul>

          <Header>Open Data</Header>
          <P>
            Climatescape maintains an
            <TextLink href="https://airtable.com/shraY1nLoEKJ8UsNH/tblPH0ZgLZYGVEhEo?blocks=hide">
              Open Data Airtable
            </TextLink>
            for the community, under the permissive{" "}
            <TextLink href="http://creativecommons.org/licenses/by-sa/4.0/">
              Creative Commons BY-SA
            </TextLink>{" "}
            license. This means you&apos;re free to share and adapt the data there, providing you:
          </P>

          <ol className="list-decimal list-outside ml-5">
            <li>
              <P>
                <strong>Attribute</strong> — You must give appropriate credit,
                provide a link to the license, and indicate if changes were
                made. You may do so in any reasonable manner, but not in any way
                that suggests we endorse you or your use.
              </P>
            </li>
            <li>
              <P>
                <strong>Share Alike</strong> — If you remix, transform, or build
                upon the material, you must distribute your contributions under
                the{" "}
                <TextLink href="https://creativecommons.org/licenses/by-sa/4.0/" />
                same license as the original.
              </P>
            </li>
          </ol>
          <Header>Community Contributors</Header>
          <P>
            Climatescape is a community-driven platform built by people from
            around the globe. If you&apos;d like to offer your skills and
            knowledge to help us improve, please fill out the form below. We
            draw from these applications on a continuous basis and reach out as
            new opportunities arise.
          </P>
          <P>
            <TextLink newWindow href={contributorFormUrl}>
              Become a contributor
            </TextLink>
          </P>
          <div className="flex flex-wrap mt-4">
            {contributors.map(contributor => (
              <ContributorCard
                key={contributor.name}
                avatar={contributor.avatar}
                website={contributor.website}
                name={contributor.name}
              />
            ))}
          </div>
          <Header>Contact Us</Header>
          <P>
            <TextLink href="mailto:team@climatescape.org">
              team@climatescape.org
            </TextLink>
          </P>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ContributorsQuery {
    site {
      siteMetadata {
        capitalAddFormUrl
        organizationAddFormUrl
        contributorFormUrl
      }
    }
    contributors: allAirtable(filter: { table: { eq: "Contributors" } }) {
      nodes {
        data {
          Name
          Join_Date
          Contributions
          Website
          Type
          Avatar {
            localFiles {
              childImageSharp {
                fluid(maxWidth: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
