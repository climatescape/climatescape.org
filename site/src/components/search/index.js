/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, createRef } from "react"
import classnames from "classnames"
import {
  InstantSearch,
  Index,
  Highlight,
  Configure,
  connectHits,
} from "react-instantsearch-dom"
import algoliasearch from "algoliasearch/lite"
import { Link } from "gatsby"
import Input from "./input"
import Results from "./Results"
import PoweredBy from "./PoweredBy"

import "./styles.css"

const PageHit = () => ({ hit, selected, onMouseHover }) => (
  <div
    className={classnames(
      "text-gray-700 hit px-4 truncate w-full flex items-center",
      {
        selected,
      }
    )}
    onMouseEnter={onMouseHover}
  >
    <Link to={`/organizations/${hit.path}`} className="flex-grow">
      <h4>
        <Highlight attribute="name" hit={hit} tagName="mark" />
      </h4>
    </Link>
  </div>
)

const hitComps = { PageHit }

const Hits = connectHits(
  ({
    hits,
    hitComponent,
    onMouseHoverHit,
    selectedIndex,
    onMouseLeaverHits,
  }) => (
    <ul className="ais-Hits-list" onMouseLeave={onMouseLeaverHits}>
      {hits.map((hit, index) => (
        <li key={hit.objectID} className="ais-Hits-item">
          {React.createElement(hitComponent, {
            hit,
            selected: index === selectedIndex,
            onMouseHover: () => onMouseHoverHit(index),
          })}
        </li>
      ))}
    </ul>
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

const indices = [{ name: `Pages`, title: `Pages`, hitComp: `PageHit` }]

function SearchContent({
  searchQuery,
  focus,
  onFocus,
  onRemoveFocus,
  collapse,
}) {
  const NO_LINE_SELECTED = -1
  // By default we use -1 and not 0 to avoid displaying a selected background on the first result of
  // the list, which can be weird when using the mouse to hover an item of the list: it would display
  // the first line and the hovered line with the same background.
  // This way we enter the "keyboard navigation mode" only when up/down is used.
  const [selectedIndex, setSelectedIndex] = useState(NO_LINE_SELECTED)

  React.useEffect(() => {
    // reset selected index if we reset the search query
    if (searchQuery?.length === 0) {
      setSelectedIndex(NO_LINE_SELECTED)
    }
  }, [searchQuery, setSelectedIndex])

  // keyboard shortcuts handling
  const handleKeyDown = e => {
    // we use javascript to retrieve the number of hits.
    // tried to connect this SearchContent component to retrieve the number of hits using
    // connectHits, connectStats, and connectStateResults on Search but it didn't worked.
    const nbHits = document.querySelectorAll(".hits-wrapper .hit")?.length

    const UP_KEY = 38
    const DOWN_KEY = 40
    const ENTER_KEY = 13

    // arrow up/down button should select next/previous list element
    if (e.keyCode === UP_KEY) {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1)
      } else {
        setSelectedIndex(nbHits - 1)
      }
    } else if (e.keyCode === DOWN_KEY) {
      if (selectedIndex < nbHits - 1) {
        setSelectedIndex(selectedIndex + 1)
      } else {
        setSelectedIndex(0)
      }
    }
    // enter key
    else if (e.keyCode === ENTER_KEY) {
      // Edge case: Break when there are no search results to avoid going to
      // Algolia's website
      if (nbHits <= 0) return
      // When the keyboard has not been used to select an item (using up/down arrow) and we use
      // enter we select the first item of the list.
      if (selectedIndex === NO_LINE_SELECTED) {
        document.querySelector(".hits-wrapper a")?.click()
      } else {
        // simulate a click on the link of the selected line.
        document.querySelector(".hits-wrapper .selected a")?.click()
      }
    }
  }

  //
  // hover handling
  // Behaviour: like Google search:
  // - when we hover an item, the selectedIndex becames the index of the hovered item, so when we
  //   use the up/down button, it begins at the mouse hover position.
  // - when the mouse quit the search block, we reset the selectedIndex
  //

  // when the mouse quit the search block, we reset the selectedIndex
  const handleOnMouseLeaverHits = () => {
    setSelectedIndex(NO_LINE_SELECTED)
  }

  // when the mouse is hover an item, the selectedIndex becames the index of the hovered item, so
  //  when we use the up/down button, it begins at the mouse hover position.
  const handleOnMouseHoverHit = hitIndex => {
    setSelectedIndex(hitIndex)
  }

  return (
    <>
      <Configure hitsPerPage={8} />
      <Input
        className="w-full"
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        {...{ collapse, focus }}
      />
      {searchQuery?.length > 0 && focus && (
        <div className="hits-wrapper fixed w-full grid z-10 left-0 right-0 top-0 overflow-hidden bg-white border border-gray-500 md:absolute md:rounded-md scrolling-touch transform translate-y-10 md:translate-y-12">
          {/* <HitsWrapper show={searchQuery?.length > 0 && focus}> */}
          {indices.map(({ name, hitComp }) => (
            <Index key={name} indexName={name}>
              <Results>
                <Hits
                  hitComponent={hitComps[hitComp](onRemoveFocus)}
                  selectedIndex={selectedIndex}
                  onMouseLeaverHits={handleOnMouseLeaverHits}
                  onMouseHoverHit={handleOnMouseHoverHit}
                />
              </Results>
            </Index>
          ))}
          <PoweredBy />
        </div>
      )}
    </>
  )
}

function Search({ collapse }) {
  const ref = createRef()
  const [searchQuery, setQuery] = useState(``)
  const [focus, setFocus] = useState(false)
  useClickOutside(ref, () => setFocus(false))

  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  )

  return (
    <div className="relative flex-grow flex items-center" ref={ref}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
        onSearchStateChange={({ query }) => setQuery(query)}
      >
        <SearchContent
          searchQuery={searchQuery}
          collapse={collapse}
          focus={focus}
          onFocus={() => setFocus(true)}
          onRemoveFocus={() => setFocus(false)}
        />
      </InstantSearch>
    </div>
  )
}

export default Search
