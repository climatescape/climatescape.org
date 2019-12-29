import React from "react"

import Layout from "../components/layout"

const AboutPage = () => (
  <Layout>
    <div className="max-w-3xl mx-auto p-4 text-gray-900">
      <h2 className="header">About</h2>
      <p className="mt-4">
        This website was created...
      </p>
      <p className="mt-4">
        All content on this site is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>. The source code is licensed under the MIT software license and is available on GitHub.
      </p>
    </div>
  </Layout>
)

export default AboutPage
