const intersection = require("lodash/intersection")
const mapValues = require("lodash/mapValues")
const union = require("lodash/union")

const CountRoles = [
  "Products & Services",
  "Research & Development",
  "Advocacy",
  "Network",
]

function countCategoriesOrganizations(orgs) {
  const ids = orgs.reduce((accum, { id: catId, data }) => {
    const parentId = data.Parent && data.Parent[0].id
    const orgIds =
      data.Organizations &&
      data.Organizations.filter(
        org => intersection(org.data.Role, CountRoles).length
      ).map(o => o.id)

    if (orgIds) {
      accum[catId] = union(accum[catId], orgIds)
      if (parentId) accum[parentId] = union(accum[parentId], orgIds)
    }

    return accum
  }, {})

  return mapValues(ids, "length")
}

module.exports = {
  countCategoriesOrganizations,
}
