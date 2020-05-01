import React, { useState } from "react"
import classnames from "classnames"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartFilled } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons"

export default function FavoriteButton({ organizationId, className }) {
  const [favorited, setFavorited] = useState(false)
  const [count, setCount] = useState(Math.round(147 * Math.random()))

  const handleClick = event => {
    event.preventDefault()

    setFavorited(!favorited)
    setCount(count + (favorited ? -1 : 1))
  }

  return (
    <button
      className={classnames(
        "text-gray-600 h-18 ml-4 px-4 py-2 flex-shrink-0 self-center text-center rounded hover:bg-gray-200",
        className
      )}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={favorited ? heartFilled : heartOutline}
        className={classnames(
          favorited ? "text-red-500" : "",
          "fill-curent text-lg"
        )}
      />
      <div className="text-sm">{count}</div>
    </button>
  )
}
