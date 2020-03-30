import React, { useState, useEffect, createRef } from "react"
import {
  InstantSearch,
  Index,
  Hits,
  Highlight,
  Configure,
  connectStateResults,
} from "react-instantsearch-dom"
import algoliasearch from "algoliasearch/lite"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlgolia } from "@fortawesome/free-brands-svg-icons"
import useBreakpoint from "../../utils/useBreakpoint"
import Input from "./input"
import { Root } from "./styles"

import "./styles.css"

const PageHit = () => ({ hit }) => (
  <div className="text-gray-700 hit truncate w-full">
    <Link to={`/organizations/${hit.path}`}>
      <h4>
        <Highlight attribute="name" hit={hit} tagName="mark" />
      </h4>
    </Link>
  </div>
)

const hitComps = { PageHit }

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }) =>
    res && res.nbHits > 0 ? (
      children
    ) : (
      <div className="no-results text-center md:text-left text-gray-700">
        <span>
          No results found for <span className="highlight">{state.query}</span>
        </span>
      </div>
    )
)

const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`mousedown`, `touchstart`]

  const detectClickOutside = event => {
    return !ref.current.contains(event.target) ? handler() : null
  }

  useEffect(() => {
    for (const event of events)
      document.addEventListener(event, detectClickOutside)
    return () => {
      for (const event of events)
        document.removeEventListener(event, detectClickOutside)
    }
  })
}
const PoweredBy = () => (
  <div className="algolia-bar text-gray-700">
    <span>
      <a href="https://algolia.com">
        <FontAwesomeIcon icon={faAlgolia} className="mr-2" />
        powered by Aloglia
      </a>
    </span>
  </div>
)

const indices = [{ name: `Pages`, title: `Pages`, hitComp: `PageHit` }]

export default function Search({ collapse }) {
  const ref = createRef()
  const [searchQuery, setQuery] = useState(``)
  const [focus, setFocus] = useState(false)
  const { isDesktop, isMobile } = useBreakpoint()
  useClickOutside(ref, () => setFocus(false))

  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  )

  return (
    <div className="search-root" ref={ref}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
        onSearchStateChange={({ query }) => setQuery(query)}
        root={{ Root, props: { ref } }}
      >
        <Configure hitsPerPage={8} />
        <Input
          className="w-full"
          onFocus={() => setFocus(true)}
          {...{ collapse, focus }}
        />
        {searchQuery?.length > 0 && focus && (
          <div className="hits-wrapper fixed w-full grid z-10 left-0 right-0 overflow-hidden bg-white border border-gray-500 md:absolute md:rounded-md scrolling-touch">
            {/* <HitsWrapper show={searchQuery?.length > 0 && focus}> */}
            {indices.map(({ name, hitComp }) => (
              <Index key={name} indexName={name}>
                <Results>
                  <Hits
                    hitComponent={hitComps[hitComp](() => setFocus(false))}
                  />
                </Results>
              </Index>
            ))}
            <PoweredBy />
          </div>
        )}
      </InstantSearch>
    </div>
  )
}
