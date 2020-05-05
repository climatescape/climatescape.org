import { keyBy, mapValues } from "lodash"
import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartFilled } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons"

export const GetFavorites = gql`
  query GetFavorites($loggedIn: Boolean!, $userId: String) {
    favorites (
      where: { user_id: { _eq: $userId } }
    ) @include(if: $loggedIn) {
      id
      record_id
    }

    favorites_count {
      record_id
      count
    }
  }
`

// Accepts raw data from the GetFavorites query and returns an object indexed
// by record_id that has both count and the user's favorite ID
export function indexFavoritesData(data) {
  if (!data) return {}

  const counts = keyBy(data.favorites_count, "record_id")
  const favorites = keyBy(data.favorites, "record_id")

  return mapValues(counts, ({ record_id, count }) => ({
    count, // The total count of favorites
    id: favorites[record_id]?.id, // The user's favorite
  }))
}

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
  count: propCount,
  favoriteId: propFavoriteId,
}) {
  const [favoriteId, setFavoriteId] = useState()
  const [count, setCount] = useState()
  const favorited = !!favoriteId

  useEffect(() => {
    setFavoriteId(propFavoriteId)
    setCount(propCount || 0)
  }, [propFavoriteId, propCount])

  const [addFavorite, { loading: addLoading }] = useMutation(AddFavorite, {
    variables: { recordId },
    refetchQueries: ["GetFavorites"],
    onCompleted: data => {
      setFavoriteId(data.insert_favorites.returning[0].id)
      setCount(count + 1)
    },
  })

  const [deleteFavorite, { loading: deleteLoading }] = useMutation(
    DeleteFavorite,
    {
      variables: { id: favoriteId },
      refetchQueries: ["GetFavorites"],
      onCompleted: () => {
        setFavoriteId(undefined)
        setCount(count - 1)
      },
    }
  )

  const handleClick = event => {
    event.preventDefault()

    if (addLoading || deleteLoading) return

    if (!favorited) addFavorite()
    else deleteFavorite()
  }

  return (
    <button
      className={classnames(
        "text-gray-600 h-16 ml-4 px-4 py-2 flex-shrink-0 self-center text-center rounded hover:bg-gray-200",
        className
      )}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={favorited ? heartFilled : heartOutline}
        className={classnames(
          "fill-curent text-lg",
          { "text-red-500": favorited },
        )}
      />
      <div className="text-sm">{count}</div>
    </button>
  )
}
