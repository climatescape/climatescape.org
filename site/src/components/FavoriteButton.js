import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { useAuth0 } from "./Auth0Provider"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartFilled } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons"

import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/react-hooks"

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

const GetFavoriteId = gql`
  query favoriteIdQuery($userId: String, $recordId: String!) {
    favorites(
      where: { user_id: { _eq: $userId }, record_id: { _eq: $recordId } }
    ) {
      id
    }
  }
`

const GetCount = gql`
  query countQuery($recordId: String!) {
    favorites_aggregate(where: { record_id: { _eq: $recordId } }) {
      aggregate {
        count
      }
    }
  }
`

export default function FavoriteButton({
  recordId,
  className,
  favoriteId: existingFavoriteId,
}) {
  const [favoriteId, setFavoriteId] = useState(existingFavoriteId)
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState()
  const { loading: authenticationLoading, user } = useAuth0()

  useEffect(() => {
    if (authenticationLoading) return
    setUserId(user.sub)
  }, [authenticationLoading])

  useQuery(GetFavoriteId, {
    onCompleted: data => setFavoriteId(data.favorites[0]?.id),
    variables: {
      userId,
      recordId,
    },
  })

  useQuery(GetCount, {
    onCompleted: data => setCount(data.favorites_aggregate.aggregate.count),
    variables: { recordId },
  })

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
        "text-gray-600 h-16 ml-4 px-4 py-2 flex-shrink-0 self-center text-center rounded hover:bg-gray-200",
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
