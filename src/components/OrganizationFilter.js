import React, { useState } from "react"
import {
  OrganizationCategory,
  OrganizationTag,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
} from "./OrganizationAttributes"

export const useOrganizationFilterState = () => {
  const [byCategory, setSectorFilter] = useState(null)
  const [byTag, setTagFilter] = useState(null)
  const [byLocation, setLocationFilter] = useState(null)
  const [byHeadcount, setHeadcountFilter] = useState(null)
  const [byOrgType, setOrgTypeFilter] = useState(null)

  const setFilter = {
    byCategory: setSectorFilter,
    byTag: setTagFilter,
    byLocation: setLocationFilter,
    byHeadcount: setHeadcountFilter,
    byOrgType: setOrgTypeFilter,
    none: () => {
      setSectorFilter(null)
      setTagFilter(null)
      setLocationFilter(null)
      setHeadcountFilter(null)
      setOrgTypeFilter(null)
    },
  }

  const applyFilter = organizations => {
    if (byCategory)
      organizations = organizations.filter(org =>
        org.categories.find(cat => cat.id === byCategory?.id)
      )

    if (byTag)
      organizations = organizations.filter(
        org => org.tags && org.tags.indexOf(byTag) >= 0
      )

    if (byLocation)
      organizations = organizations.filter(org => org.location === byLocation)

    if (byHeadcount)
      organizations = organizations.filter(org => org.headcount === byHeadcount)

    if (byOrgType)
      organizations = organizations.filter(org => org.orgType === byOrgType)

    return organizations
  }

  return [
    { byCategory, byTag, byLocation, byHeadcount, byOrgType },
    setFilter,
    applyFilter,
  ]
}

const OrganizationFilter = ({ currentFilter, onClearFilter }) => {
  const {
    byCategory,
    byTag,
    byLocation,
    byHeadcount,
    byOrgType,
  } = currentFilter
  const hasFilterApplied =
    byCategory || byTag || byLocation || byHeadcount || byOrgType
  return (
    <>
      {hasFilterApplied && (
        <p className="text-gray-700  text-sm">
          <span className="mr-2">Filtered by</span>
          {byCategory && <OrganizationCategory active text={byCategory.name} />}
          {byTag && <OrganizationTag active text={byTag} />}
          {byLocation && <OrganizationLocation active text={byLocation} />}
          {byHeadcount && <OrganizationHeadcount active text={byHeadcount} />}
          {byOrgType && <OrganizationOrgType active text={byOrgType} />}
          <button
            onClick={() => onClearFilter()}
            className="underline hover:no-underline ml-1"
          >
            clear
          </button>
        </p>
      )}
    </>
  )
}

export default OrganizationFilter
