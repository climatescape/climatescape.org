import React from "react"
import { connectStateResults } from "react-instantsearch-dom"

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }) =>
    res && res.nbHits > 0 ? (
      children
    ) : (
      <div className="text-gray-700">
        <span className="pl-4 leading-8">
          No results found for{" "}
          <span className="pl-0 font-bold">{state.query}</span>
        </span>
      </div>
    )
)
export default Results
