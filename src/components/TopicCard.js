import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

const TopicCard = ({ title, count, img, path }) => (
  <div className="sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
    <Link to={path}  className="block rounded overflow-hidden shadow-md relative">
      <Img fluid={img} className="w-full h-40 object-cover" />
      <div className="px-2 py-1 img-title-overlay w-full text-xl font-bold absolute bottom-0 left-0 text-white">{title}</div>
    </Link>
  </div>
)

export default TopicCard
