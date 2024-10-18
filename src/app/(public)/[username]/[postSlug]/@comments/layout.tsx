import React from 'react'

const LayoutComment = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='space-y-4 p-4' id='comments'>
      <h4 className='text-2xl font-bold'>Comments</h4>
      {children}
    </div>
  )
}

export default LayoutComment
