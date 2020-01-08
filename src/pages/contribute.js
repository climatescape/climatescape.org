import React from "react"

import Layout from "../components/layout"

const ContributePage = () => (
  <Layout>
    <div className="container mx-auto">
      <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js"></script>
      <iframe title="Contribute form" className="airtable-embed airtable-dynamic-height" src="https://airtable.com/embed/shrp9xqFD66l8IbPo?backgroundColor=purple" frameBorder="0" onmousewheel="" width="100%" height="763"></iframe>
    </div>
  </Layout>
)

export default ContributePage
