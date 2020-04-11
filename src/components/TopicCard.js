import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

export default function TopicCard({ category }) {
  return (
    <div className="w-full sm:w-1/2 md:w-1/4 p-3">
      <Link
        to={category.slug}
        className="block rounded overflow-hidden shadow-md relative"
      >
        {category.cover && (
          <Img
            fluid={category.cover}
            className="w-full h-40 object-cover pointer-events-none select-none"
          />
        )}
        <div className="px-3 py-2 img-title-overlay w-full text-xl font-bold absolute bottom-0 left-0 text-white tracking-wide">
          {category.name}
        </div>
      </Link>
    </div>
  )
}
