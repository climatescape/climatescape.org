import React from "react"
import Tag from "./Tag"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBuilding, faLocationArrow, faTag } from '@fortawesome/free-solid-svg-icons'

export const OrganizationTag = ({ text, ...props }) => (
  <Tag
      { ...props }
    ><FontAwesomeIcon icon={faTag} className="mr-1" />{text}</Tag>
)

export const OrganizationLocation = ({ text, ...props }) => (
  <Tag
      { ...props }
    ><FontAwesomeIcon icon={faLocationArrow} className="mr-1" />{text}</Tag>
)

export const OrganizationHeadcount = ({ text, ...props }) => (
    <Tag
        { ...props }
      ><FontAwesomeIcon icon={faUsers} className="mr-1" />{text}</Tag>
  )
  
export const OrganizationOrgType = ({ text, ...props }) => (
    <Tag
        { ...props }
      ><FontAwesomeIcon icon={faBuilding} className="mr-1" />{text}</Tag>
  )
  