import React, { Fragment } from "react"
import classnames from "classnames"
import { Link } from "gatsby"

function Item({ icon, text, href, className, hidden, slug }) {
  if (hidden) {
    return null
  }

  let props
  if (slug) props = { to: slug, className: "flex flex-row underline" }
  if (href)
    props = {
      className: className ? classnames(className) : "flex underline",
      href,
      target: "_blank",
      rel: "noopener noreferrer",
    }

  const Component = slug ? Link : href ? "a" : Fragment

  return (
    <li className="flex flex-row mt-3 font-medium text-sm text-gray-800 hover:text-gray-600">
      <Component {...props}>
        <div className="mr-3 w-3">{icon}</div>
        <span>{text}</span>
      </Component>
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

export default SidebarSectionList
