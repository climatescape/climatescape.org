import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

const AddOrganizationCTA = ({ url, text = "Add an organization" }) => (
  <div className="text-center py-10">
    <a
      href={url}
      className="px-4 py-2 leading-none border rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-500"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faPlus} className="mr-2" />
      {text}
    </a>
  </div>
)

AddOrganizationCTA.propTypes = {
  url: PropTypes.string,
}

export default AddOrganizationCTA
