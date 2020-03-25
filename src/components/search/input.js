import React from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

import { Input } from "./styles"

export function SearchInput() {
  return (
    <div className="search-root">
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
