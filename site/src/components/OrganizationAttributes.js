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
} from "@fortawesome/free-solid-svg-icons"

import Tag from "./Tag"
import {
  summarizeCapitalStages,
  summarizeCapitalCheckSizes,
} from "../utils/capital"

export const OrganizationCategory = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faBox} className="mr-2" />
    {text}
  </Tag>
)

export const OrganizationLocation = ({
  location: { country, region, locality },
  ...props
}) => {
  const text = locality || region || country

  return (
    <Tag {...props}>
      <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
      {text}
    </Tag>
  )
}

export const OrganizationHeadcount = ({ text, compact, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faUsers} className="mr-2" />
    {text}
  </Tag>
)

export const OrganizationOrgType = ({ text, ...props }) => (
  <Tag {...props}>
    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
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

export const OrganizationCapitalStage = ({ stages, ...props }) => {
  const text = summarizeCapitalStages(stages)

  return (
    <Tag {...props}>
      <FontAwesomeIcon icon={faSearchDollar} className="mr-1" />
      {text}
    </Tag>
  )
}

export const OrganizationCapitalCheckSize = ({ checkSizes, ...props }) => {
  const text = summarizeCapitalCheckSizes(checkSizes)

  return (
    <Tag {...props}>
      <FontAwesomeIcon icon={faMoneyCheck} className="mr-1" />
      {text}
    </Tag>
  )
}
