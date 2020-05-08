import { keyBy, mapValues } from "lodash"
import { useState, useEffect } from "react"
import { useLazyQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { useAuth0 } from "../components/Auth0Provider"
import { graphql } from "gatsby"

export const GetFavorites = gql`
  query GetFavorites($loggedIn: Boolean!, $userId: uuid) {
    favorites(where: { userId: { _eq: $userId } }) @include(if: $loggedIn) {
      id
      recordId
    }

    favoritesCount {
      recordId
      count
    }
  }
`

// For Gatsby to pull favorites when building the site
export const query = graphql`
  fragment StaticFavorites on Query {
    climatescape {
      favoritesCount {
        recordId
        count
      }
    }
  }
`

// Accepts raw data from the GetFavorites query and returns an object indexed
// by record_id that has both count and the user's favorite ID
function indexFavoritesData(data) {
  if (!data) return {}

  const counts = keyBy(data.favoritesCount, "recordId")
  const favorites = keyBy(data.favorites, "recordId")

  return mapValues(counts, ({ recordId, count }) => ({
    count, // The total count of favorites
    id: favorites[recordId]?.id, // The user's favorite
  }))
}

const APP_CLAIM = "https://climatescape.org/app"
// Fetches all favorites data from the GraphQL API, waiting until Auth0 is done
// loading so that the current user's favorites may be fetched. Returns a hooked
// object that will eventually take the following shape:
// {
//   "rec1": { count: 14, id: "uuid-of-users-favorite" },
//   "rec2": { count: 2, id: null },
// }
export function useFavorites(defaultData) {
  const { loading: authLoading, user } = useAuth0()
  const [favorites, setFavorites] = useState({})
  const uuid = user?.[APP_CLAIM]?.uuid

  const [getFavorites, { data }] = useLazyQuery(GetFavorites, {
    variables: {
      loggedIn: !!user,
      userId: uuid,
    },
  })

  useEffect(() => {
    if (!authLoading) getFavorites()
  }, [authLoading])

  useEffect(() => {
    const favData = data || defaultData

    if (favData) setFavorites(indexFavoritesData(favData))
  }, [data, defaultData])

  return favorites
}
