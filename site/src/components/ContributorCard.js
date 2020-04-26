import React from "react"
import Img from "gatsby-image"

const ContributorCard = ({ name, contributions, avatar, website }) => (
  <a href={website} className="flex py-1 rounded items-center">
    <Img className="w-10 h-10 m-1 rounded" fluid={avatar} />
    <div className="pl-2">
      <div className="h-5">{name}</div>
      <div className="text-gray-600">{contributions}</div>
    </div>
  </a>
)

export default ContributorCard
