import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBox,
  faUsers,
  faBuilding,
  faLocationArrow,
  faHandHoldingUsd,
  faSearchDollar,
  faHandshake,
  faMoneyCheck,
  faTag,
} from "@fortawesome/free-solid-svg-icons"
import Tag from "./Tag"

export const OrganizationSector = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faBox} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationTag = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faTag} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationLocation = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faLocationArrow} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationHeadcount = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faUsers} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationOrgType = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faBuilding} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationCapitalType = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faHandHoldingUsd} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationCapitalStrategic = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faHandshake} className="mr-1" />
    Strategic
  </Tag>
)

export const OrganizationCapitalStage = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faSearchDollar} className="mr-1" />
    {text}
  </Tag>
)

export const OrganizationCapitalCheckSize = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faMoneyCheck} className="mr-1" />
    {text}
  </Tag>
)
