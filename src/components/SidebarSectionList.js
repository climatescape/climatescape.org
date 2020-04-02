import React from "react"
import classnames from "classnames"

const liClassName = "flex flex-row mt-3 font-medium text-sm text-gray-800"

function Link({ icon, text, href, className }) {
  if (!href) {
    return null
  }

  return (
    <li className={liClassName}>
      <a
        className={className ? classnames(className) : "flex underline"}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="mr-3">{icon}</div>
        <span>{text}</span>
      </a>
    </li>
  )
}

function Item({ icon, text }) {
  return (
    <li className={liClassName}>
      <div className="mr-3">{icon}</div>
      <span>{text}</span>
    </li>
  )
}

/**
 * Defines a section on the sidebar that is displayed as a list and have Item as children.
 */
function SidebarSectionList({ title, children, className }) {
  return (
    <div className={classnames(className)}>
      {title && <div className="uppercase text-sm text-semibold">{title}</div>}
      <ul>{children}</ul>
    </div>
  )
}

SidebarSectionList.Item = Item
SidebarSectionList.Link = Link

export default SidebarSectionList
