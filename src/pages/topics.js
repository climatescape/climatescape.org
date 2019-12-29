import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import TopicCard from "../components/TopicCard"

const TopicsPage = () => {
  const data = useStaticQuery(graphql`
    query SectorsQuery {
      allAirtable(filter: {table: {eq: "Sectors"}}) {
        nodes {
          data {
            Name
            Organizations_Count
            Slug
            Cover {
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
  `)

  return <Layout contentClassName="bg-gray-200">
    <div className="p-3 flex flex-wrap">
      {
        data.allAirtable.nodes.map(node =>
          <TopicCard title={node.data.Name} count={node.data.Organizations_Count} img={node.data.Cover.localFiles[0].childImageSharp.fluid} path={`/sectors/${node.data.Slug}`} />
        )
      }
    </div>
  </Layout>
}

export default TopicsPage
