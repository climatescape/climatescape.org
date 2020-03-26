import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import OrganizationFilter from "./OrganizationFilter"

const IndexHeader = ({
  title,
  buttonText,
  buttonUrl,
  filter,
  onClearFilter,
}) => (
  <div className="border-b border-gray-400 py-3">
    <div className="flex items-center">
      <h2 className="text-2xl tracking-wide md:mt-4 flex-grow">{title}</h2>

      {buttonText && buttonUrl && (
        <a
          href={buttonUrl}
          className="px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          {buttonText}
        </a>
      )}
    </div>

    <OrganizationFilter currentFilter={filter} onClearFilter={onClearFilter} />
  </div>
)

export default IndexHeader
