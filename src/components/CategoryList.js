import React from "react"
import { Link } from "gatsby"
import Pill from "./Pill"

function Category({ category, categories, selected }) {
  const isSelected = category.id === selected?.id
  const subCategories = categories.filter(sub => category.id === sub.parent?.id)

  const count = subCategories.reduce(
    (sum, cat) => sum + cat.count,
    category.count
  )

  return (
    <li className={`font-sans my-1 `}>
      <Link to={category.slug}>
        <Pill name={category.name} count={count} selected={isSelected} />
      </Link>
    </li>
  )
}

export default function({ categories, pageContext }) {
  const selected = categories.find(
    category => category.id === pageContext.categoryId
  )
  const parent = selected?.parent || selected
  const topCategories = categories.filter(category => !category.parent)
  const subCategories = categories.filter(
    category => category.count && category.parent?.id === parent?.id
  )

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
            categories={categories}
            selected={parent}
          />
        ))}
      </ul>
      {selected && subCategories.length > 0 && (
        <>
          <h3
            style={{ maxWidth: "90%" }}
            className="text-sm font-title tracking-wide mt-8 mb-4 uppercase text-gray-700 leading-snug"
          >
            {parent.name} Subcategories
          </h3>
          <ul>
            {subCategories.map(category => (
              <Category
                key={category.id}
                category={category}
                categories={categories}
                selected={selected}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
