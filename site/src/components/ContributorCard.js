import React from "react"
import Img from "gatsby-image"

const ContributorCard = ({ name, contributions, avatar, website }) => (
  <a href={website} className="flex rounded items-center hover:bg-indigo-100" title={name} target="_blank" rel="noopener noreferrer">
    <Img className="w-12 h-12 m-1 rounded" fluid={avatar} />
    { !!name && !!contributions && (
      <div className="pl-2">
        <div className="h-5">{name}</div>
        <div className="text-gray-600">{contributions}</div>
      </div>
    )}
  </a>
)

export default ContributorCard
