import React from "react"
import classnames from "classnames"
import Img from "gatsby-image"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { stringShorten } from "../utils/string"

const LinkClassName = "underline hover:text-gray-600"

function Item({ icon, title, text, href, to, img }) {
  let props = { className: "inline-flex" }
  let imgProps
  let Wrapper
  if (img) {
    Wrapper = Link
    props = { to, className: props.className }
    imgProps = {
      fixed: img,
      className: "OrganizationCard-logo border blend-multiply w-16 h-16",
    }
  } else if (to) {
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
        {title ? (
          <div className="flex flex-col mr-4">
            <span className="text-black font-medium">{title}</span>
            {text && <span>{stringShorten(text)}</span>}
          </div>
        ) : (
          <span>{text}</span>
        )}
        {img && <Img {...imgProps} />}
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
