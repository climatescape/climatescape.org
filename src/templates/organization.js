import React from "react"

import Layout from "../components/layout"

const OrganizationTemplate = (props) => {
  console.log(props)
  return <Layout>
    <div className="max-w-3xl mx-auto p-4 text-gray-900">
      <h2 className="header">Organization</h2>
      <p className="mt-4">
        {props.Slug}
      </p>
    </div>
  </Layout>
}

export default OrganizationTemplate
