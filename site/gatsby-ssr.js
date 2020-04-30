/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

 const React = require("react")

 const { Auth0Provider } = require("./src/components/Auth0Provider")

 exports.wrapRootElement = ({ element }) => (
   <Auth0Provider
     redirect_uri={"noop"}
     onRedirectCallback={() => {}}
   >
     {element}
   </Auth0Provider>
 )
