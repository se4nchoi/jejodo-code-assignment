import React from 'react'

const SpanTextToBeHighlighted = ({ text="", highlight="", classNames="" }) => {
  if (!highlight.trim()) {
    return <span className={classNames}>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)

  return (
    <span className={classNames}>
      {parts.filter(String).map((part, i) => {
        return regex.test(part) ? 
          (
            <span key={i} style={{ backgroundColor: "rgba(68, 152, 242, 0.5)"}}
            >
              {part}
            </span>
          )
          :
          (
            <span key={i}
            >
              {part}
            </span>
          )
      })}
    </span>
  )
  
}

export default SpanTextToBeHighlighted