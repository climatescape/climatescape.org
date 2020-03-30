import { useState, useEffect } from "react"
import throttle from "lodash/throttle"

const getDeviceConfig = width => {
  if (width < 320) {
    return "xs"
  }

  if (width >= 320 && width < 720) {
    return "sm"
  }

  if (width >= 720 && width < 1024) {
    return "md"
  }

  return "lg"
}

/**
 * from https://medium.com/better-programming/usebreakpoint-hook-get-media-query-breakpoints-in-react-3f1779b73568
 */
const useBreakpoint = () => {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const calcInnerWidth = throttle(() => {
      setWidth(window.innerWidth)
    }, 200)
    window.addEventListener("resize", calcInnerWidth)
    return () => window.removeEventListener("resize", calcInnerWidth)
  }, [])

  const point = getDeviceConfig(width)

  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const isDesktop = width >= 1024

  return {
    point,
    width,
    xs: point === "xs",
    sm: point === "sm",
    md: point === "md",
    lg: point === "lg",
    isMobile,
    isTablet,
    isDesktop,
  }
}

export default useBreakpoint
