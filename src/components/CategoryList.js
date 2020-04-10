import React from "react"
import { Link } from "gatsby"
import Pill from "./Pill"

function Category({ category, count, selected }) {
  if (!count) return null // Don't show categories without organizations

  return (
    <li className="font-sans my-1">
      <Link to={category.slug}>
        <Pill name={category.name} count={count} selected={selected} />
      </Link>
    </li>
  )
}

export default function({ categories, activeCategoryId, categoryCounts }) {
  const selected = categories.find(category => category.id === activeCategoryId)
  const parent = selected?.parent || selected
  const topCategories = categories.filter(cat => !cat.parent)
  const subCategories = categories.filter(cat => cat.parent?.id === parent?.id)

  return (
    <div className="CategoryList leading-9 hidden w-1/5  mb-8 lg:block">
      <h3 className="text-sm font-title  tracking-wide mt-8 uppercase text-gray-700">
        Categories
      </h3>
      <ul>
        {topCategories.map(category => (
          <Category
            key={category.id}
            category={category}
            count={categoryCounts[category.id]}
            selected={category.id === parent?.id}
          />
        ))}
      </ul>
      {parent && subCategories.length && (
        <>
          <h3
            style={{ maxWidth: "90%" }}
            className="text-sm font-title tracking-wide mt-8 mb-4 uppercase text-gray-700 leading-snug"
          >
            {parent?.name} Subcategories
          </h3>
          <ul>
            {subCategories.map(category => (
              <Category
                key={category.id}
                category={category}
                count={categoryCounts[category.id]}
                selected={category.id === selected.id}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
