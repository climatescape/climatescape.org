import React from "react"
import { Link } from "gatsby"
import classnames from "classnames"

import "./CategoryList.css"

function TopCategory({ category, pageContext }) {
  const selected = category.id === pageContext.categoryId

  return (
    <li className={classnames("TopCategory ", { selected })}>
      <Link to={category.slug}>{category.name}</Link>
    </li>
  )
}

export default function({ categories, pageContext }) {
  const topLevelCategories = categories.filter(category => !category.parent)

  return (
    <div className="CategoryList leading-9 hidden w-1/5 pl-6 lg:block">
      <h3 className="mt-8 uppercase text-gray-700">Categories</h3>
      <ul>
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
