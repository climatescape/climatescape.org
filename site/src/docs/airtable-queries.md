## Sample airtable queries

[explorer](http://localhost:8000/__graphQl)
[Gatsby+GraphQL docs](https://www.gatsbyjs.org/docs/graphql-reference/)

### Top Level Categories

```graphql
query PagesQuery {
  categories: allAirtable(
    filter: {
      table: { eq: "Categories" }
      data: { Parent: { elemMatch: { id: { eq: null } } } }
    }
  ) {
    nodes {
      id
      data {
        Name
        Count
        Cover {
          id
        }
        Parent {
          id
        }
      }
    }
  }
}
```

### Orgs who are in a sub-category

```graphql
query OrganizationsPageQuery {
  organizations: allAirtable(
    filter: {
      table: { eq: "Organizations" }
      data: {
        Categories: {
          elemMatch: {
            data: {
              Parent: {
                elemMatch: {
                  id: { eq: "e87c5017-f367-5dea-80fb-8308cb290825" }
                }
              }
            }
          }
        }
      }
    }
  ) {
    nodes {
      data {
        Name
        Homepage
        Categories {
          id
          data {
            Parent {
              id
            }
          }
        }
      }
    }
  }
}
```

### Orgs who are in a top category

```graphql
query OrganizationsPageQuery {
  organizations: allAirtable(
    filter: {
      table: { eq: "Organizations" }
      data: {
        Categories: {
          elemMatch: { id: { eq: "e87c5017-f367-5dea-80fb-8308cb290825" } }
        }
      }
    }
  ) {
    nodes {
      data {
        Name
        Homepage
        Categories {
          id
          data {
            Parent {
              id
            }
          }
        }
      }
    }
  }
}
```

### Organization query

```graphql
query OrganizationPageQuery {
  organization: airtable(
    table: { eq: "Organizations" }
    id: { eq: "73ecae54-a3d6-5424-bf12-e347ce76c30f" }
  ) {
    id
    data {
      Name
    }
  }
}
```

### Capital Profiles

```graphql
query CapitalPageQuery {
  capitalProfiles: allAirtable(filter: { table: { eq: "Capital Profiles" } }) {
    nodes {
      id
      data {
        Check_Size
      }
    }
  }
}
```

### Capital Types

```graphql
query CapitalPageQuery {
  capitalTypes: allAirtable(filter: { table: { eq: "Capital Types" } }) {
    nodes {
      id
      data {
        Name
        Slug
        Cover {
          id
        }
      }
    }
  }
}
```
