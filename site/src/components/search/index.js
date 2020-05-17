import React, { useMemo, useState, useRef } from "react"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, Configure } from "react-instantsearch-dom"

import useClickOutside from "../../utils/useClickOutside"
import client from "./client"
import SearchBox from "./SearchBox"
import Hits from "./Hits"

import "./search.css"

export default function Search() {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [activeHit, setActiveHit] = useState(0)
  const [openActiveHit, setOpenActiveHit] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setFocused(false))

  const searchClient = useMemo(() =>
    client(
      algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY
      )
    )
  )

  const handleNavigateResults = direction => {
    setActiveHit(activeHit + direction)
  }

  const handleSearchStateChange = ({ query: newQuery }) => {
    setQuery(newQuery)
    setActiveHit(0)
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="Pages"
      onSearchStateChange={handleSearchStateChange}
    >
      <Configure hitsPerPage={8} />
      <div className="sm:relative w-full" ref={ref}>
        <SearchBox
          onFocus={() => setFocused(true)}
          onNavigate={handleNavigateResults}
          onEnter={() => setOpenActiveHit(true)}
        />
        {query && focused && (
          <Hits
            activeHit={activeHit}
            onChangeActiveHit={setActiveHit}
            openActiveHit={openActiveHit}
          />
        )}
      </div>
    </InstantSearch>
  )
}
