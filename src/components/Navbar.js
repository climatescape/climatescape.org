import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import Search from "./search/index"
import { SearchInput } from "./search/input"

const Navbar = () => {
  const isSSR = typeof window === "undefined"

  const data = useStaticQuery(graphql`
    query NavbarQuery {
      site {
        siteMetadata {
          title
          newsletterUrl
        }
      }
    }
  `)

  return (
    <nav className="border-b border-gray-500 px-6">
      <div className="container flex mx-auto justify-between flex-wrap">
        <Link className="flex lg:w-1/5 flex-shrink-0" to="/">
          {/* <img
            src={SiteLogo}
            alt="Logo: Earth Network"
            className="h-6 w-6 fill-current mr-3 self-center"
          /> */}
          <span className="self-center text-l py-2 font-title">
            {data.site.siteMetadata.title}
          </span>
        </Link>

        <div className="lg:w-4/5 flex justify-between border-l border-gray-500 py-2 pl-8 hidden md:flex">
          {isSSR ? <SearchInput /> : <Search />}

          <div className="text-sm sm:text-right">
            <Link
              to="/categories/atmosphere"
              className="block mt-4 sm:inline-block sm:mt-0 mr-4"
            >
              Organizations
            </Link>

            <Link
              to="/capital"
              className="block mt-4 sm:inline-block sm:mt-0 mr-4"
            >
              Capital
            </Link>

            <Link
              to="/contribute"
              className="inline-block text-sm px-4 py-2 leading-none border rounded  border-gray-600 hover:border-gray-700 mt-4 sm:mt-0"
            >
              Contribute
            </Link>
          </div>
        </div>

        {/* <div
          className={`${
            open ? "block" : "hidden"
          } flex-grow sm:flex sm:items-center sm:w-auto pt-6 sm:pt-0`}
        > */}
        {/* </div> */}
      </div>
    </nav>
  )
}

export default Navbar
