import React from "react"
import PropTypes from "prop-types"

const Section = ({ title, children }) => (
  <div className="bg-white mt-3 p-3 border-b border-gray-400">
    {title && <h4 className="text-lg">{title}</h4>}
    {children}
  </div>
)

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

export default Section
