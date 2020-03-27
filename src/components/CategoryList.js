import React from "react"
import { Link } from "gatsby"

function Pill({ name, count, selected }) {
  return (
    <div
      style={{ maxWidth: "90%" }}
      className={`no-underline inline-block truncate leading-snug text-gray-700 rounded border border-gray-300 pl-1 pr-2 ${
        selected ? "bg-gray-300" : ""
      }`}
    >
      <span className="text-sm">{name}</span>
      <span className={`${selected ? "text-gray-100" : "text-gray-400"}`}>
        &nbsp;|&nbsp;
      </span>
      <span className="text-gray-600 text-xs">{count}</span>
    </div>
  )
}

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
      <h3 className="mt-8 uppercase text-gray-700">Categories</h3>
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
          <h3 className="mt-8 mb-4 uppercase text-gray-700 leading-snug">
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
