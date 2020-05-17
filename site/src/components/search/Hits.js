import React, { useEffect } from "react"
import { Link, navigate } from "gatsby"
import { connectHits, Highlight } from "react-instantsearch-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlgolia } from "@fortawesome/free-brands-svg-icons"
import classnames from "classnames"

const PoweredBy = () => (
  <a href="https://algolia.com" className="p-1">
    <FontAwesomeIcon icon={faAlgolia} className="mr-1 text-indigo-500" />
    <span>powered by Aloglia</span>
  </a>
)

// The `activeHit` coming from the parent component has no knowedge of the
// number of results within Hits. This logic will take any integer and map it
// to one of the hits, if any
function boundedIndex(activeHit, range) {
  const bounded = activeHit % range

  return bounded < 0 ? range + bounded : bounded
}

const Hits = ({
  hits,
  activeHit,
  openActiveHit,
  onChangeActiveHit = () => {},
}) => {
  const activeIndex = boundedIndex(activeHit, hits.length)

  // The parent component can choose to open one of the hits here by setting
  // `openActiveHit` to true
  useEffect(() => {
    if (openActiveHit && hits.length)
      navigate(`/organizations/${hits[activeIndex].path}`)
  }, [openActiveHit, hits, activeIndex])

  return (
    <ul className="absolute bg-white w-screen sm:w-full left-0 border border-gray-300 sm:rounded-lg mt-1 text-md">
      {hits.map((hit, index) => (
        <li key={hit.objectID} className="border-b border-gray-200">
          <Link
            to={`/organizations/${hit.path}`}
            className={classnames("block w-full p-2", {
              "bg-gray-200": index === activeIndex,
            })}
            onMouseEnter={() => onChangeActiveHit(index)}
          >
            <Highlight attribute="name" hit={hit} />
          </Link>
        </li>
      ))}

      {!hits.length && (
        <li className="border-b border-gray-200 p-2 text-gray-600 italic">
          No results...
        </li>
      )}

      <li className="text-gray-500 text-right py-1 px-2 text-xs">
        <PoweredBy />
      </li>
    </ul>
  )
}

export default connectHits(Hits)
