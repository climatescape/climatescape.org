import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import SiteLogo from "../images/site-logo.svg"

const Navbar = () => {
  const [open, setOpen] = useState(false)

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
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <Link className="flex items-center flex-shrink-0 text-white mr-6" to="/">
        <img src={SiteLogo} alt="Logo: Earth Network" className="h-8 w-8 fill-current mr-3" />
        <span className="font-semibold text-xl">{data.site.siteMetadata.title}</span>
      </Link>

      <div className="block sm:hidden">
        <button onClick={() => setOpen(!open)} className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>

      <div className={`${open ? "block" : "hidden"} w-full flex-grow sm:flex sm:items-center sm:w-auto`}>
        <div className="text-sm sm:text-right sm:flex-grow">
          <Link to="/#about" className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-white mr-4">
            About
          </Link>

          <Link to="/#organizations" className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-white mr-4">
            Organizations
          </Link>

          <Link to="/contribute" className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-white mr-4">
            Contribute
          </Link>
        </div>
        <div>
          <a
            href={data.site.siteMetadata.newsletterUrl}
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 sm:mt-0"
            target="_blank" rel="noopener noreferrer"
          >Subscribe</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
