import React from "react"

import Layout from "../components/layout"

const ContributePage = () => (
  <Layout>
    <div className="lg:flex mx-auto container">
      <div className="p-3 pb-6 bg-blue-100 lg:w-2/5 lg:p-6">
        <h1 className="text-gray-900 text-2xl md:text-3xl font-light my-3">How to Contribute</h1>
        <p className="my-2">
          Climatescape is maintained by a global team of volunteers. If
          you're interested in joining us, here are the ways you can help:
        </p>
        <ol className="list-decimal list-outside ml-5">
          <li className="mt-1">The easiest way to contribute is to submit organizations we're missing using the form on this page</li>
          <li className="mt-1">Apply to join our <a className="underline hover:no-underline text-blue-600" href="mailto:brendan@sinceresoftware.co">editorial team</a></li>
          <li className="mt-1">Contribute to the development of this website <a className="underline hover:no-underline text-blue-600" href="https://github.com/bloudermilk/climatescape/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22">on GitHub</a></li>
        </ol>
        <p className="my-2">
          Want to help another way? <a className="underline hover:no-underline text-blue-600" href="mailto:brendan@sinceresoftware.co">Contact us</a>
        </p>
      </div>
      <div className="lg:w-3/5 border-gray-300 lg:border-r">
        <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js"></script><iframe className="airtable-embed airtable-dynamic-height" src="https://airtable.com/embed/shrVmZ8nPOrVuCPEh?backgroundColor=purple" frameBorder="0" onmousewheel="" width="100%" height="922" style={{ background: "transparent" }}></iframe>
      </div>
    </div>
  </Layout>
)

export default ContributePage
