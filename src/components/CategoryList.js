import React from "react"
import { Link } from "gatsby"
import Pill from "./Pill"

function TopCategory({ category, categories, pageContext }) {
  const selected = category.id === pageContext.categoryId
  const subCategories = categories.filter(sub => category.id === sub.parent?.id)

  const count = subCategories.reduce(
    (sum, cat) => sum + cat.count,
    category.count
  )

  return (
    <li className={`font-sans my-1 `}>
      <Link to={category.slug}>
        <Pill name={category.name} count={count} selected={selected} />
      </Link>
    </li>
  )
}

function SubCategory({ category, currentFilter, onApplyFilter }) {
  const selected = category.id === currentFilter.byCategory?.id

  return (
    <li className="font-sans my-1">
      {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        role="button"
        onClick={() => onApplyFilter.byCategory(category)}
      >
        <Pill name={category.name} count={category.count} selected={selected} />
      </a>
    </li>
  )
}

export default function({
  categories,
  onApplyFilter,
  currentFilter,
  pageContext,
}) {
  const selectedCategory = categories.find(
    category => category.id === pageContext.categoryId
  )
  const topCategories = categories.filter(category => !category.parent)
  const subCategories = categories.filter(
    category =>
      pageContext.categoryId === category.parent?.id && category.count > 0
  )

  return (
    <div className="CategoryList leading-9 hidden w-1/5  mb-8 lg:block">
      <h3 className="text-sm font-title  tracking-wide mt-8 uppercase text-gray-700">
        Categories
      </h3>
      <ul>
        {topCategories.map(category => (
          <TopCategory
            key={category.id}
            category={category}
            categories={categories}
            pageContext={pageContext}
          />
        ))}
      </ul>
      {selectedCategory && subCategories.length > 0 && (
        <>
          <h3
            style={{ maxWidth: "90%" }}
            className="text-sm font-title tracking-wide mt-8 mb-4 uppercase text-gray-700 leading-snug"
          >
            {selectedCategory.name} Categories
          </h3>
          <ul>
            {subCategories.map(category => (
              <SubCategory
                key={category.id}
                onApplyFilter={onApplyFilter}
                category={category}
                currentFilter={currentFilter}
                pageContext={pageContext}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
