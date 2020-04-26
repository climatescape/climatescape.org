import React from "react"

const FooterLink = ({ href, title, divider }) => {
  return (
    <>
      <a
        href={href}
        className="underline text-gray-800 hover:text-gray-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
      {divider && <span> • </span>}
    </>
  )
}

export default FooterLink
