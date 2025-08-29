import React from 'react'

function CustomErrorLabel({ touched, error, color, customClass=null }) {
  if (touched && error) {
    const style = color ? { color: color } : { color: '#ff0000' }
    return (
      <div className={customClass || "invalid-feedback"} >{error}</div>
    )
  }
}

export default CustomErrorLabel

