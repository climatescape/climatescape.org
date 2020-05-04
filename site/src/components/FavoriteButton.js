import React, { useState } from "react"
import classnames from "classnames"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartFilled } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons"

import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"

const AddFavorite = gql`
  mutation AddFavorite($recordId: String!) {
    insert_favorites(objects: [{ record_id: $recordId }]) {
      returning {
        id
      }
    }
  }
`

const DeleteFavorite = gql`
  mutation DeleteFavorite($id: uuid!) {
    update_favorites(
      where: { id: { _eq: $id } }
      _set: { deleted_at: "NOW()" }
    ) {
      affected_rows
    }
  }
`
export default function FavoriteButton({
  recordId,
  className,
  favoriteId: existingFavoriteId,
}) {
  const [favoriteId, setFavoriteId] = useState(existingFavoriteId)
  const [count, setCount] = useState(Math.round(147 * Math.random()))
  const [addFavorite, { loading: addLoading }] = useMutation(AddFavorite, {
    variables: { recordId },
    onCompleted: data => setFavoriteId(data.insert_favorites.returning[0].id),
  })
  const [deleteFavorite, { loading: deleteLoading }] = useMutation(
    DeleteFavorite,
    {
      variables: { id: favoriteId },
      onCompleted: () => setFavoriteId(undefined),
    }
  )

  const favorited = !!favoriteId
  const loading = addLoading || deleteLoading

  const handleClick = event => {
    event.preventDefault()

    if (loading) return

    if (!favorited) addFavorite()
    else deleteFavorite()

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
