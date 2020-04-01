import React from "react"

export default function Pill({ name, count, selected }) {
  return (
    <div
      style={{ maxWidth: "90%" }}
      className={`no-underline inline-block truncate leading-snug text-gray-700 rounded border border-gray-300 pl-1 pr-2 ${
        selected ? "bg-gray-300" : ""
      }`}
    >
      <span className="text-sm">{name}</span>
      {count && (
        <>
          <span className={`${selected ? "text-gray-100" : "text-gray-400"}`}>
            &nbsp;|&nbsp;
          </span>
          <span className="text-gray-600 text-xs">{count}</span>
        </>
      )}
    </div>
  )
}
