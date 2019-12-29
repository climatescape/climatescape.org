import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

const OrganizationCard = ({ title, img, path, description }) => (
  <div className="sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
    <Link to={path}  className="block rounded overflow-hidden shadow-md bg-white">
      <div className="m-3 h-20">
        { img && <Img fluid={img.fluid} className="object-contain" /> }
      </div>
      <div className="m-3 text-gray-900">
        <div className="text-xl font-bold truncate">{title}</div>
        <p className="overflow-hidden h-16 leading-tight">{description}</p>
      </div>
    </Link>
  </div>
)

export default OrganizationCard
