import React from 'react'

const layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='relative py-4 pb-40'>
      <div className='mx-auto max-w-5xl'>
        <h1 className='text-3xl font-bold'>Create new post</h1>
        {children}
      </div>
    </div>
  )
}

export default layout
