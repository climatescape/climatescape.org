import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

const OrganizationSocial = ({ homepage, linkedIn, twitter }) => (
  <div className="flex">
    {homepage &&
      <div className={`flex-1 text-center px-4 py-2 m-2 ${(linkedIn || twitter) && "border-r-4"}`}>
        <a className="hover:text-teal-500 text-gray-700" href={homepage} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLink} className="mr-2" />Homepage
        </a>
      </div>
    }
    {linkedIn &&
      <div className={`flex-1 text-center px-4 py-2 m-2 ${(twitter) ? "border-r-4" : ""}`}>
        <a className="hover:text-teal-500 mr-2 text-gray-700" href={linkedIn} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} className="mr-2" />LinkedIn
        </a>
      </div>
    }
    {twitter &&
      <div className="flex-1 text-center px-4 py-2 m-2">
        <a className="hover:text-teal-500 mr-2" href={twitter} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} className="mr-2" />Twitter
        </a>
      </div>
    }
  </div>
)

OrganizationSocial.propTypes = {
  homepage: PropTypes.string,
  linkedIn: PropTypes.string,
  twitter: PropTypes.string,
}

export default OrganizationSocial
