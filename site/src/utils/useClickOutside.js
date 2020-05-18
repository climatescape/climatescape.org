import { useEffect } from "react"

export default function useClickOutside(ref, handler) {
  const events = [`mousedown`, `touchstart`]

  const detectClickOutside = event => {
    return !ref.current.contains(event.target) ? handler() : null
  }

  useEffect(() => {
    for (const event of events)
      document.addEventListener(event, detectClickOutside)
    return () => {
      for (const event of events)
        document.removeEventListener(event, detectClickOutside)
    }
  })
}
