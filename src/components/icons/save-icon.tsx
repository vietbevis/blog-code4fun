import React from 'react'

const IconSave = ({ width = 24, height = 24 }: { width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      focusable='false'
      fill='currentColor'
    >
      <path d='M6.75 4.5h10.5a.75.75 0 01.75.75v14.357a.375.375 0 01-.575.318L12 16.523l-5.426 3.401A.375.375 0 016 19.607V5.25a.75.75 0 01.75-.75zM16.5 6h-9v11.574l4.5-2.82 4.5 2.82V6z'></path>
    </svg>
  )
}

export default IconSave
