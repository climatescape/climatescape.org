import React from "react"

/**
 * Used for components that requires a window to exists and would not work on SSR mode.
 */
const withWindow = Component => ({ children, ...props }) => {
  const isSSR = typeof window === "undefined"
  return isSSR ? null : React.createElement(Component, props, children)
}

export default withWindow
