import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import OrganizationFilter from "./OrganizationFilter"

const IndexHeader = ({
  title,
  buttonText,
  buttonUrl,
  filter,
  onClearFilter,
  onApplyFilter,
  organizations,
  allOrganizations,
  showFilters,
}) => (
  <div className="border-b border-gray-400 py-3">
    <div className="flex items-center md:mt-4 ">
      <h2 className="text-2xl tracking-wide font-title flex-grow">{title}</h2>

      <span className="text-gray-800 mr-2 hidden sm:block">
        {organizations?.length} organizations
      </span>

      {buttonText && buttonUrl && (
        <a
          href={buttonUrl}
          className="px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {buttonText}
        </a>
      )}
    </div>

    <OrganizationFilter
      currentFilter={filter}
      onClearFilter={onClearFilter}
      onApplyFilter={onApplyFilter}
      organizations={allOrganizations}
      showFilters={showFilters}
    />
  </div>
)

export default IndexHeader
