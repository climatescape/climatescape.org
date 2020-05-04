/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

const React = require("react")
const { navigate } = require("gatsby")

const { Auth0Provider } = require("./src/components/Auth0Provider")
const {
  AuthorizedApolloProvider,
} = require("./src/components/AuthorizedApolloProvider")

exports.wrapRootElement = ({ element }) => (
  <Auth0Provider
    cacheLocation="localstorage"
    useRefreshTokens={true}
    redirect_uri={location.origin + "/authback"}
    onRedirectCallback={() => navigate("/login")}
  >
    <AuthorizedApolloProvider>{element}</AuthorizedApolloProvider>
  </Auth0Provider>
)
