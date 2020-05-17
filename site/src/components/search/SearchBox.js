import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { connectSearchBox } from "react-instantsearch-dom"

const UP_KEY = 38
const DOWN_KEY = 40
const ENTER_KEY = 13

const SearchBox = ({
  currentRefinement,
  refine,
  onFocus = () => {},
  onNavigate = () => {},
  onEnter = () => {},
}) => {
  const handleKeyDown = event => {
    switch (event.keyCode) {
      case UP_KEY:
        event.preventDefault()
        onNavigate(-1)
        break
      case DOWN_KEY:
        event.preventDefault()
        onNavigate(1)
        break
      case ENTER_KEY:
        event.preventDefault()
        onEnter()
        break
      default:
      // Do nothing, user is probably just typing their query
    }
  }

  return (
    <div className="flex items-center relative">
      <FontAwesomeIcon
        icon={faSearch}
        className="ml-4 text-gray-500 pointer-events-none absolute left-0"
      />
      <input
        value={currentRefinement}
        className="transition-colors duration-100 ease-in-out focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 py-2 pr-4 pl-10 block w-full appearance-none leading-normal"
        onChange={event => refine(event.currentTarget.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        placeholder="Search Climatescape"
      />
    </div>
  )
}

export default connectSearchBox(SearchBox)
