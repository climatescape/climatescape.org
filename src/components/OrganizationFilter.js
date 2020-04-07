import React, { useState } from "react"

import Select from "react-select"

// We prefer to use Tailwind when possible, but this is the preferred way to
// achieve custom styles with react-select. See https://react-select.com/styles
const styles = {
  container: styles => ({
    ...styles,
    display: "inline-block",
    marginRight: "8px",
    maxWidth: "30%",
    height: "28px",
    verticalAlign: "middle",
  }),
  control: provided => ({
    ...provided,
    minHeight: "28px",
    maxHeight: "28px",
    borderRadius: "9999px",
    maxWidth: "100%",
    backgroundColor: "#f7fafc",
  }),
  indicatorsContainer: provided => ({
    ...provided,
    height: "24px",
  }),
  indicatorSeparator: provided => ({
    ...provided,
    display: "none",
  }),
  clearIndicator: provided => ({
    ...provided,
    padding: "5px",
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: "0px",
    paddingRight: "5px",
  }),
  placeholder: provided => ({
    ...provided,
    position: "static",
    top: "auto",
    transform: "none",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  menu: provided => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
  }),

  option: (provided, { isFocused }) => {
    return {
      ...provided,
      backgroundColor: isFocused ? "#e2e8f0" : null,
    }
  },
  singleValue: provided => ({
    ...provided,
    maxWidth: "none",
    position: "static",
    top: "auto",
    transform: "none",
  }),
  valueContainer: provided => ({
    ...provided,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  }),
}


export const useOrganizationFilterState = () => {
  const [byCategory, setCategoryFilter] = useState(null)
  const [byLocation, setLocationFilter] = useState(null)
  const [byHeadcount, setHeadcountFilter] = useState(null)
  const [byOrgType, setOrgTypeFilter] = useState(null)
  const [byCapitalType, setCapitalTypeFilter] = useState(null)
  const [byCapitalStrategic, setCapitalStrategicFilter] = useState(null)
  const [byCapitalStage, setCapitalStageFilter] = useState(null)
  const [byCapitalCheckSize, setCapitalCheckSizeFilter] = useState(null)

  const setFilter = {
    byCategory: setCategoryFilter,
    byLocation: setLocationFilter,
    byHeadcount: setHeadcountFilter,
    byOrgType: setOrgTypeFilter,
    byCapitalType: setCapitalTypeFilter,
    byCapitalStrategic: setCapitalStrategicFilter,
    byCapitalStage: setCapitalStageFilter,
    byCapitalCheckSize: setCapitalCheckSizeFilter,
    none: () => {
      setCategoryFilter(null)
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

const formatSubcategoryOptions = (categories, pageContext) => {
  let subCategories = categories
    .filter(
      category =>
        pageContext.categoryId === category.parent?.id && category.count > 0
    )
    .map(result => ({
      value: result,
      label: result.name,
    }))

  return [{ value: null, label: "Any" }, ...subCategories]
}

const formatHeadcounts = organizations => {
  let formatted = organizations
    .reduce((array, organization) => {
      let { headcount } = organization
      return array.includes(headcount) || headcount == null
        ? array
        : [...array, headcount]
    }, [])
    .sort((a, b) => {
      return (
        parseInt(a.match(/\d+,?/gi).pop()) - parseInt(b.match(/\d+,?/gi).pop())
      )
    })
    .map(result => ({
      value: result,
      label: result,
    }))

  formatted.unshift({ value: null, label: "Any" })

  return formatted
}

const formatOrgTypes = organizations => {
  let formatted = organizations
    .reduce((array, organization) => {
      let { orgType } = organization
      return array.includes(orgType) || orgType == null
        ? array
        : [...array, orgType]
    }, [])
    .map(result => ({
      value: result,
      label: result,
    }))

  formatted.unshift({ value: null, label: "Any" })

  return formatted
}

const OrganizationFilter = ({
  currentFilter,
  categories,
  pageContext,
  onApplyFilter,
  organizations,
}) => {
  const { byCategory, byHeadcount, byOrgType } = currentFilter

  const formattedSubcategories = pageContext
    ? formatSubcategoryOptions(categories, pageContext)
    : null

  const formattedHeadCounts = pageContext
    ? formatHeadcounts(organizations)
    : null
  const formattedOrgTypes = pageContext ? formatOrgTypes(organizations) : null

  // <Select
  //   options={formattedSubcategories}
  //   onChange={category => onApplyFilter.byCategory(category?.value)}
  //   styles={styles}
  //   isSearchable={false}
  //   placeholder={byCategory?.name ?? "Sub category"}
  //   value={byCategory?.name ?? null}
  // />
  return (
    <>
      {
        <div className="text-gray-700  text-sm max-w-6xl mt-3">
          <span className="mr-2 inline-block h-6 min-h-full">
            <span>{organizations?.length} Companies | </span>
            Filter by
          </span>

          <Select
            options={formattedHeadCounts}
            onChange={headcount => onApplyFilter.byHeadcount(headcount?.value)}
            styles={styles}
            isSearchable={false}
            placeholder={byHeadcount || "Headcount"}
            value={byHeadcount}
          />
          <Select
            options={formattedOrgTypes}
            onChange={orgType => onApplyFilter.byOrgType(orgType?.value)}
            styles={styles}
            isSearchable={false}
            placeholder={byOrgType || "Org Type"}
            value={byOrgType}
          />
        </div>
      }
    </>
  )
}

export default OrganizationFilter
