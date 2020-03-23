import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons"

const OrganizationSocial = ({ homepage, linkedIn, twitter }) => (
  <div className="flex flex-col">
    {homepage && (
      <div
        className={`flex-1 text-center ${(linkedIn || twitter) &&
          "border-r-4"}`}
      >
        <a
          className="hover:text-teal-500 px-4 py-2 text-gray-700"
          href={homepage}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLink} className="mr-2" />
          Homepage
        </a>
      </div>
    )}
    {linkedIn && (
      <div className={`flex-1 text-center ${twitter ? "border-r-4" : ""}`}>
        <a
          className="hover:text-teal-500 px-4 py-2 text-gray-700"
          href={linkedIn}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
          LinkedIn
        </a>
      </div>
    )}
    {twitter && (
      <div className="flex-1 text-center">
        <a
          className="hover:text-teal-500 px-4 py-2 text-gray-700"
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-2" />
          Twitter
        </a>
      </div>
    )}
  </div>
)

OrganizationSocial.propTypes = {
  homepage: PropTypes.string,
  linkedIn: PropTypes.string,
  twitter: PropTypes.string,
}

export default OrganizationSocial
