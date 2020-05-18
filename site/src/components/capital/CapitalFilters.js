import React from "react"
import { Link } from "gatsby"
import { capitalStages } from "../../utils/capital"
import Pill from "../Pill"

function CapitalType({ type, selected }) {
  return (
    <li className="font-sans my-1">
      <Link to={type.slug}>
        <Pill name={type.name} selected={selected} />
      </Link>
    </li>
  )
}

function CapitalStage({ stage, currentFilter, onApplyFilter }) {
  const selected = stage === currentFilter.byCapitalStage
  const handleClick = () =>
    onApplyFilter.byCapitalStage(selected ? null : stage)

  return (
    <li className={`font-sans my-1 `}>
      {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={handleClick}>
        <Pill name={stage} selected={selected} />
      </a>
    </li>
  )
}

function Stages({ currentFilter, onApplyFilter }) {
  return (
    <>
      <h3 className="text-sm font-mono tracking-wide mt-8 uppercase text-gray-700">
        Stages
      </h3>
      <ul>
        {capitalStages.map(stage => (
          <CapitalStage
            key={stage}
            stage={stage}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
          />
        ))}
      </ul>
    </>
  )
}

export default function CapitalFilters({
  capitalTypes,
  activeType,
  currentFilter,
  onApplyFilter,
}) {
  const showStages = activeType?.name === "Venture Capital"

  return (
    <div className="CategoryList leading-9 hidden w-1/5  mb-8 lg:block">
      <h3 className="text-sm font-mono tracking-wide mt-8 uppercase text-gray-700">
        Capital
      </h3>
      <ul>
        {capitalTypes.map(type => (
          <CapitalType
            key={type.slug}
            type={type}
            selected={type.id === activeType?.id}
          />
        ))}
      </ul>
      {showStages && (
        <Stages currentFilter={currentFilter} onApplyFilter={onApplyFilter} />
      )}
    </div>
  )
}
