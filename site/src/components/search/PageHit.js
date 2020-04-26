import React from "react"
import { Link } from "gatsby"
import { Highlight } from "react-instantsearch-dom"
import classnames from "classnames"

export default function PageHit() {
  return ({ hit, selected, onMouseHover }) => (
    <div
      className={classnames(
        "text-gray-700 flex items-center px-4 truncate w-full",
        {
          selected,
        }
      )}
      onMouseEnter={onMouseHover}
    >
      <Link to={`/organizations/${hit.path}`}>
        <h4>
          <Highlight attribute="name" hit={hit} tagName="mark" />
        </h4>
      </Link>
    </div>
  )
}
