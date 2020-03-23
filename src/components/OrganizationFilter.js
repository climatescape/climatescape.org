import React, { useState } from "react"
import {
  OrganizationSector,
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
  const [bySector, setSectorFilter] = useState(null)
  const [byTag, setTagFilter] = useState(null)
  const [byLocation, setLocationFilter] = useState(null)
  const [byHeadcount, setHeadcountFilter] = useState(null)
  const [byOrgType, setOrgTypeFilter] = useState(null)
  const [byCapitalType, setCapitalTypeFilter] = useState(null)
  const [byCapitalStrategic, setCapitalStrategicFilter] = useState(null)
  const [byCapitalStage, setCapitalStageFilter] = useState(null)
  const [byCapitalCheckSize, setCapitalCheckSizeFilter] = useState(null)

  const setFilter = {
    bySector: setSectorFilter,
    byTag: setTagFilter,
    byLocation: setLocationFilter,
    byHeadcount: setHeadcountFilter,
    byOrgType: setOrgTypeFilter,
    byCapitalType: setCapitalTypeFilter,
    byCapitalStrategic: setCapitalStrategicFilter,
    byCapitalStage: setCapitalStageFilter,
    byCapitalCheckSize: setCapitalCheckSizeFilter,
    none: () => {
      setSectorFilter(null)
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
    if (bySector)
      organizations = organizations.filter(
        org => (org.sector && org.sector.slug) === bySector.slug
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
        org => org.capitalType && org.capitalType.indexOf(byCapitalType) >= 0
      )

    if (byCapitalStrategic)
      organizations = organizations.filter(
        org => org.capitalStrategic === byCapitalStrategic
      )

    if (byCapitalStage)
      organizations = organizations.filter(
        org => org.capitalStage && org.capitalStage.indexOf(byCapitalStage) >= 0
      )

    if (byCapitalCheckSize)
      organizations = organizations.filter(
        org =>
          org.capitalCheckSize &&
          org.capitalCheckSize.indexOf(byCapitalCheckSize) >= 0
      )

    return organizations
  }

  return [
    {
      bySector,
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
    bySector,
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
    bySector ||
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
        <p className="p-3 text-gray-700 bg-gray-100 border-b border-gray-400 text-sm">
          <span className="mr-2">Filtered by</span>
          {bySector && <OrganizationSector active text={bySector.name} />}
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
