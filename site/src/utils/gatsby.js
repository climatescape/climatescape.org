const _ = require("lodash")

const CountRoles = [
  "Products & Services",
  "Research & Development",
  "Advocacy",
  "Network",
]

function countCategoriesOrganizations(categories) {
  return _.chain(categories)
    .reduce((accum, { id: catId, data }) => {
      const parentId = data.Parent && data.Parent[0].id
      const orgIds =
        data.Organizations &&
        data.Organizations.filter(
          org => _.intersection(org.data.Role, CountRoles).length
        ).map(o => o.id)

      if (orgIds) {
        accum[catId] = (accum[catId] || []).concat(orgIds)
        if (parentId) accum[parentId] = (accum[parentId] || []).concat(orgIds)
      }

      return accum
    }, {})
    .mapValues(orgIds => new Set(orgIds).size)
    .value()
}

module.exports = {
  countCategoriesOrganizations,
}
