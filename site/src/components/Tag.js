import React from "react"

const Tag = ({ children, active, onClick, ...otherProps }) => {
  let className =
    "inline-block mt-1 px-2 py-1 text-xs rounded-full text-gray-700 mr-2"

  if (active) {
    className += " bg-gray-300"
    onClick = null
  }

  const props = { ...otherProps, className, onClick }

  if (onClick) {
    return <button {...props}>{children}</button>
  }
  return <span {...props}>{children}</span>
}

export default Tag
