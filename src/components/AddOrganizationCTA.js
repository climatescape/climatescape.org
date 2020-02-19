import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"

const VARIANTS = { simple: "simple", detailed: "detailed" }

const AddOrganizationCTA = ({
  variant = VARIANTS.detailed,
  text = "Add a missing organization",
}) => {
  const className =
    variant === VARIANTS.detailed ? "display-block" : "text-sm align-middle"

  return (
    <>
      {variant === VARIANTS.detailed && (
        <div>
          If you know any organizations solving climate change, we would love to
          have your recommendation.
        </div>
      )}
      <span
        className={`${className} text-gray-600 hover:text-teal-500 ml-3 whitespace-no-wrap`}
      >
        <Link to="/contribute">
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          {text}
        </Link>
      </span>
    </>
  )
}

AddOrganizationCTA.propTypes = {
  variant: PropTypes.string,
  text: PropTypes.string,
}

export default AddOrganizationCTA
