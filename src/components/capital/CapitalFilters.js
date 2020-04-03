import React from "react"
import { Link } from "gatsby"
import { capitalTypes, capitalStages } from "../../utils/capital"
import Pill from "../Pill"

function CapitalType({ type, pageContext }) {
  const selected = type.name === pageContext.capitalType

  return (
    <li className={`font-sans my-1 `}>
      <Link to={`/capital/${type.slug}`}>
        <Pill name={type.name} selected={selected} />
      </Link>
    </li>
  )
}

function CapitalStage({ type, currentFilter, onApplyFilter }) {
  const selected = type === currentFilter.byCapitalStage

  return (
    <li className={`font-sans my-1 `}>
      {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={() => onApplyFilter.byCapitalStage(type)}>
        <Pill name={type} selected={selected} />
      </a>
    </li>
  )
}

function Stages({ pageContext, currentFilter, onApplyFilter }) {
  if (pageContext.capitalType !== "Venture Capital") {
    return null
  }

  return (
    <>
      <h3 className="text-sm font-title  tracking-wide mt-8 uppercase text-gray-700">
        Stages
      </h3>
      <ul>
        {capitalStages.map(type => (
          <CapitalStage
            key={type}
            type={type}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
          />
        ))}
      </ul>
    </>
  )
}

export default function CapitalFilters({
  pageContext,
  currentFilter,
  onApplyFilter,
}) {
  return (
    <div className="CategoryList leading-9 hidden w-1/5  mb-8 lg:block">
      <h3 className="text-sm font-title  tracking-wide mt-8 uppercase text-gray-700">
        Capital
      </h3>
      <ul>
        {capitalTypes.map(type => (
          <CapitalType
            key={type.slug}
            type={type}
            categories={capitalTypes}
            pageContext={pageContext}
          />
        ))}
      </ul>
      <Stages
        pageContext={pageContext}
        currentFilter={currentFilter}
        onApplyFilter={onApplyFilter}
      />
    </div>
  )
}
