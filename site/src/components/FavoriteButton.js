import React, { useState, useMemo } from "react"
import noop from "lodash/noop"
import classnames from "classnames"
import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartFilled } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons"

import { useAuth0 } from "./Auth0Provider"

const AddFavorite = gql`
  mutation AddFavorite($recordId: String!) {
    insertFavorites(objects: [{ recordId: $recordId }]) {
      returning {
        id
      }
    }
  }
`

const DeleteFavorite = gql`
  mutation DeleteFavorite($id: uuid!) {
    updateFavorites(where: { id: { _eq: $id } }, _set: { deletedAt: "NOW()" }) {
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
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const [favoriteId, setFavoriteId] = useState()
  const [count, setCount] = useState()
  const favorited = !!favoriteId

  useMemo(() => {
    setFavoriteId(propFavoriteId)
    setCount(propCount || 0)
  }, [propFavoriteId, propCount])

  const [addFavorite, { loading: addLoading }] = useMutation(AddFavorite, {
    variables: { recordId },
    refetchQueries: ["GetFavorites"],
    onCompleted: data => {
      setFavoriteId(data.insertFavorites.returning[0].id)
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

    if (!isAuthenticated) loginWithRedirect()
    else if (addLoading || deleteLoading) noop()
    else if (!favorited) addFavorite()
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
        className={classnames("fill-curent text-lg", {
          "text-red-500": favorited,
        })}
      />
      <div className="text-sm">{count}</div>
    </button>
  )
}
