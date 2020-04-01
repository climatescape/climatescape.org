import React from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

function Input({
  isSearchStalled,
  indexContextValue,
  createURL,
  currentRefinement,
  focus,
  ...rest
}) {
  return (
    <input
      {...rest}
      className="outline-none border-none bg-transparent text-gray-800 leading-8 font-title flex flex-grow placeholder-gray-800"
    />
  )
}

export function SearchInput() {
  return (
    <div className="relative flex-grow flex items-center">
      <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-600" />
      <Input type="text" placeholder="Search" aria-label="Search" />
    </div>
  )
}

export default connectSearchBox(({ refine, ...rest }) => (
  <>
    <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-600" />
    <Input
      type="text"
      placeholder="Search"
      aria-label="Search"
      onChange={e => refine(e.target.value)}
      {...rest}
    />
  </>
))
