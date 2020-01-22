import React from "react"
import Tag from "./Tag"

const OrganizationFilter = ({ currentFilter: {tagFilter}, onClearFilter }) => (<>
      { tagFilter && <p className="p-3 text-gray-700 bg-gray-100 border-b border-gray-400 text-sm">
      <span className="mr-2">Filtered by</span>
      <Tag active={true}>{tagFilter}</Tag>
      <button
        onClick={e => onClearFilter()}
        className="underline hover:no-underline ml-1"
      >clear</button>
    </p>}
  </>);

export default OrganizationFilter
