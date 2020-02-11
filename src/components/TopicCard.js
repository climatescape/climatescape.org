import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

const TopicCard = ({ title, img, path }) => (
  <div className="w-full sm:w-1/2 md:w-1/4 p-3">
    <Link to={path}  className="block rounded overflow-hidden shadow-md relative">
      <Img fluid={img} className="w-full h-40 object-cover" />
      <div className="px-3 py-2 img-title-overlay w-full text-xl font-bold absolute bottom-0 left-0 text-white tracking-wide">{title}</div>
    </Link>
  </div>
)

export default TopicCard
