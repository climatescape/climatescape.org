import React, { useState } from "react"
import {
  OrganizationCategory,
  OrganizationTag,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
  OrganizationCapitalType,
  OrganizationCapitalStrategic,
  OrganizationCapitalStage,
  OrganizationCapitalCheckSize,
} from "./OrganizationAttributes"

export const useOrganizationFilterState = () => {
  const [byCategory, setCategoryFilter] = useState(null)
  const [byTag, setTagFilter] = useState(null)
  const [byLocation, setLocationFilter] = useState(null)
  const [byHeadcount, setHeadcountFilter] = useState(null)
  const [byOrgType, setOrgTypeFilter] = useState(null)
  const [byCapitalType, setCapitalTypeFilter] = useState(null)
  const [byCapitalStrategic, setCapitalStrategicFilter] = useState(null)
  const [byCapitalStage, setCapitalStageFilter] = useState(null)
  const [byCapitalCheckSize, setCapitalCheckSizeFilter] = useState(null)

  const setFilter = {
    byCategory: setCategoryFilter,
    byTag: setTagFilter,
    byLocation: setLocationFilter,
    byHeadcount: setHeadcountFilter,
    byOrgType: setOrgTypeFilter,
    byCapitalType: setCapitalTypeFilter,
    byCapitalStrategic: setCapitalStrategicFilter,
    byCapitalStage: setCapitalStageFilter,
    byCapitalCheckSize: setCapitalCheckSizeFilter,
    none: () => {
      setCategoryFilter(null)
      setTagFilter(null)
      setLocationFilter(null)
      setHeadcountFilter(null)
      setOrgTypeFilter(null)
      setCapitalTypeFilter(null)
      setCapitalStrategicFilter(null)
      setCapitalStageFilter(null)
      setCapitalCheckSizeFilter(null)
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

    if (byCapitalType)
      organizations = organizations.filter(
        org => org.capitalProfile?.type?.indexOf(byCapitalType) >= 0
      )

    if (byCapitalStrategic)
      organizations = organizations.filter(
        org => org.capitalProfile?.strategic === byCapitalStrategic
      )

    if (byCapitalStage)
      organizations = organizations.filter(
        org => org.capitalProfile?.stage?.indexOf(byCapitalStage) >= 0
      )

    if (byCapitalCheckSize)
      organizations = organizations.filter(
        org => org.capitalProfile?.checkSize?.indexOf(byCapitalCheckSize) >= 0
      )

    return organizations
  }

  return [
    {
      byCategory,
      byTag,
      byLocation,
      byHeadcount,
      byOrgType,
      byCapitalType,
      byCapitalStrategic,
      byCapitalStage,
      byCapitalCheckSize,
    },
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
    byCapitalType,
    byCapitalStrategic,
    byCapitalStage,
    byCapitalCheckSize,
  } = currentFilter

  const hasFilterApplied =
    byCategory ||
    byTag ||
    byLocation ||
    byHeadcount ||
    byOrgType ||
    byCapitalType ||
    byCapitalStrategic ||
    byCapitalStage ||
    byCapitalCheckSize

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
          {byCapitalType && (
            <OrganizationCapitalType active text={byCapitalType} />
          )}
          {byCapitalStrategic && <OrganizationCapitalStrategic active />}
          {byCapitalStage && (
            <OrganizationCapitalStage active text={byCapitalStage} />
          )}
          {byCapitalCheckSize && (
            <OrganizationCapitalCheckSize active text={byCapitalCheckSize} />
          )}
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
