import React from "react"
import classnames from "classnames"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const LinkClassName = "underline hover:text-gray-600"

function Item({ icon, text, href, to }) {
  let props = { className: "inline-flex" }
  let Wrapper
  if (to) {
    Wrapper = Link
    props = { to, className: classnames(LinkClassName, props.className) }
  } else if (href) {
    Wrapper = "a"
    props = {
      className: classnames(LinkClassName, props.className),
      href,
      target: "_blank",
      rel: "noopener noreferrer",
    }
  } else {
    Wrapper = "div"
  }

  return (
    <li className="mt-3 font-medium text-sm text-gray-800">
      <Wrapper {...props}>
        {icon && (
          <div className="mr-3 w-3">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        <span>{text}</span>
      </Wrapper>
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
