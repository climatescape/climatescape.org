import React from "react"
import { Link } from "gatsby"

import "./CategoryList.css"

function TopCategory({ category, pageContext }) {
  const isSelected = category.id === pageContext.categoryId

  return (
    <li
      className={`category ${
        isSelected ? "selected " : "underline"
      } font-sans   text-gray-700`}
    >
      <Link
        to={category.slug}
        className={`${isSelected ? "bg-gray-300 " : ""}`}
      >
        {category.name}
      </Link>
    </li>
  )
}

export default function({ categories, pageContext }) {
  const topLevelCategories = categories.filter(category => !category.parent)

  return (
    <div className="left-sidebar hidden lg:block  lg:w-1/5 ">
      <h3 className="mt-8 uppercase leading-9 text-gray-700">Categories</h3>
      <ul className="category-list">
        {topLevelCategories.map(category => (
          <TopCategory
            key={category.id}
            category={category}
            pageContext={pageContext}
          />
        ))}
      </ul>
    </div>
  )
}
