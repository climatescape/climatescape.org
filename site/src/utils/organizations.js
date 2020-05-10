import sortBy from "lodash/sortBy"
import trim from "lodash/trim"

export const sortOrganizations = organizations =>
  sortBy(organizations, [
    // First by number of favs (DESC)
    ({ favorite }) => -(favorite?.count || 0),
    // Then by presence of description
    ({ description }) => !trim(description).length,
    // Finally by title, case-insensitive (ASC)
    ({ title }) => title.toUpperCase(),
  ])
