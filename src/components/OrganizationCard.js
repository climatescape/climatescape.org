import React from "react"

import Tag from "./Tag"

const OrganizationCard = ({ title, description, tags, homepage, onPickTag, activeTag }) => (
  <div className="border-b border-gray-400 p-3 text-gray-900">
    <a className="font-bold text-lg hover:text-teal-500" href={homepage} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
    <p className="max-h-12 overflow-hidden">{description}</p>
    <div>
      {
        tags && tags.map((tag, i) =>
          <Tag
            onClick={e => onPickTag(tag)}
            key={i}
            active={tag === activeTag}
          >{tag}</Tag>
        )
      }
    </div>
  </div>
)

export default OrganizationCard
