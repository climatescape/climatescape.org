import React, { useState, useEffect, createRef } from "react"
import {
  InstantSearch,
  Index,
  Hits,
  Highlight,
  Configure,
  connectStateResults,
  RefinementList,
} from "react-instantsearch-dom"

import algoliasearch from "algoliasearch/lite"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuilding } from "@fortawesome/free-solid-svg-icons"
import { faAlgolia } from "@fortawesome/free-brands-svg-icons"
import Input from "./input"
import { Root, HitsWrapper } from "./styles"

import "./styles.css"

// const ConnectedRefinementList = connectRefinementList(RefinementList)

const PageHit = () => ({ hit }) => (
  <div className="text-gray-700 hit">
    {hit.logo ? (
      <img alt="Search" src={hit.logo} />
    ) : (
      <FontAwesomeIcon
        icon={faBuilding}
        className="mr-2"
        style={{ color: "#6d7571" }}
      />
    )}
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
    res && res.nbHits > 0 ? children : `No results for '${state.query}'`
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
        <FontAwesomeIcon
          icon={faAlgolia}
          className="mr-2"
          style={{ color: "#5468ff" }}
        />
        powered by Aloglia
      </a>
    </span>
  </div>
)

const indices = [{ name: `Pages`, title: `Pages`, hitComp: `PageHit` }]

export function SearchInput({ collapse, searchQuery }) {
  const ref = createRef()
  const [focus, setFocus] = useState(false)

  useClickOutside(ref, () => setFocus(false))

  return (
    <div className="search-root" ref={ref}>
      <Input onFocus={() => setFocus(true)} {...{ collapse, focus }} />
      <HitsWrapper show={searchQuery && searchQuery.length > 0 && focus}>
        {indices.map(({ name, hitComp }) => (
          <Index key={name} indexName={name}>
            <Results>
              <Hits hitComponent={hitComps[hitComp](() => setFocus(false))} />
            </Results>
          </Index>
        ))}
        <PoweredBy />
      </HitsWrapper>
    </div>
  )
}

export default function Search({ children, setQuery }) {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  )

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indices[0].name}
      onSearchStateChange={({ query }) => setQuery(query)}
      // root={{ Root, props: { ref } }}
      styles={{ position: "relative" }}
    >
      <Configure hitsPerPage={8} />
      {children}
    </InstantSearch>
  )
}
