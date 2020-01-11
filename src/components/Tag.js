import React from "react"

const Tag = ({ children, active, onClick, ...otherProps }) => {
  let className = "inline-block mt-1 bg-gray-200 hover:bg-teal-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"

  if (active) {
    className += " bg-teal-200"
    onClick = null
  }

  const props = { ...otherProps, className, onClick, }

  if (onClick) {
    return <button {...props}>{children}</button>
  } else {
    return <span {...props}>{children}</span>
  }
}

export default Tag
