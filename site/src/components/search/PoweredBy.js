import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlgolia } from "@fortawesome/free-brands-svg-icons"

export default function PoweredBy() {
  return (
    <div className="leading-8 text-left inline-block pl-4 border-t border-gray-300 rounded-b-sm justify-center flex text-gray-700">
      <span className="inline-block">
        <a href="https://algolia.com">
          <FontAwesomeIcon icon={faAlgolia} className="mr-2 text-indigo-500" />
          <span>powered by Aloglia</span>
        </a>
      </span>
    </div>
  )
}
