import React from "react"

const FooterLink = ({ href, title, divider }) => {
  return (
    <>
      <a
        href={href}
        className="underline hover:no-underline"
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
