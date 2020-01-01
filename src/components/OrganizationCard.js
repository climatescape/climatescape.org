import React from "react"

const OrganizationCard = ({ title, description, tags, homepage }) => (
  <div className="border-b border-gray-400 p-3 text-gray-900">
    <a className="font-bold text-lg hover:text-teal-500" href={homepage} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
    <p className="max-h-12 overflow-hidden">{description}</p>
    <div>
      {
        tags.map(tag =>
          <span class="inline-block mt-1 bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">{tag}</span>
        )
      }
    </div>
  </div>
)

export default OrganizationCard
