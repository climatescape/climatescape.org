import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { useAuth0 } from "./Auth0Provider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"
import classnames from "classnames"

import Search from "./search"
import ClimatescapeLogo from "../images/climatescape.svg"
import ClimatescapeMark from "../images/climatescape-mark.svg"

const NavLink = ({ children, ...props }) => (
  <Link className="mr-1 p-2 hover:text-gray-900" {...props}>
    {children}
  </Link>
)

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [ showMenu, setShowMenu ] = useState(false)

  const toggleMenu = () => setShowMenu(!showMenu)

  const data = useStaticQuery(graphql`
    query NavbarQuery {
      site {
        siteMetadata {
          newsletterUrl
        }
      }
    }
  `)

  return (
    <nav className="border-b border-gray-300 fixed top-0 inset-x-0 z-10 bg-white">
      <div className="max-w-screen-xl mx-auto px-2 flex flex-col lg:flex-row">
        <div className="flex flex-grow">
          <Link className="px-2 sm:px-3 flex flex-none" to="/">
            <img
              src={ClimatescapeLogo}
              alt="Climatescape Logo"
              className="self-center w-56 h-auto hidden sm:inline"
            />
            <img
              src={ClimatescapeMark}
              alt="Climatescape Logo"
              className="self-center h-8 w-8 sm:hidden"
            />
          </Link>

          <div className="flex flex-grow m-2 sm:mx-8 md:mx-12 xl:mx-16">
            <Search />
          </div>

          <button onClick={toggleMenu} className="flex-shrink-0 px-2 sm:px-3 lg:hidden">
            <FontAwesomeIcon fixedWidth size="lg" icon={showMenu ? faTimes : faBars} className="text-gray-700" />
          </button>
        </div>

        <div className={classnames(
          "text-md flex-none text-gray-600 flex text-left flex-shrink-0 flex-col mb-2",
          { "hidden": !showMenu },
          "lg:flex lg:flex-row lg:items-center lg:mb-0"
        )}>
          <NavLink to="/organizations">Organizations</NavLink>
          <NavLink to="/capital">Capital</NavLink>
          <NavLink to="/contribute">Contribute</NavLink>

          {isAuthenticated ? (
            <button className="p-2 hover:text-gray-900 text-left" onClick={() => logout()}>
              Sign out
            </button>
          ) : (
            <button
              className="mx-3 px-4 my-2 py-1 border rounded border-gray-600 hover:text-gray-900 hover:border-gray-800"
              onClick={() => loginWithRedirect()}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
