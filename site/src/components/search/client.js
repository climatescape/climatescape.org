// Use a wrapper client to avoid querying Aloglia when there is no query
// https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/js/
export default function client(algoliaClient) {
  return {
    search(requests) {
      if (requests.every(({ params }) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            processingTimeMS: 0,
          })),
        })
      }

      return algoliaClient.search(requests)
    },
  }
}
