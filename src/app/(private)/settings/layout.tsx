import React from 'react'

const LayoutSettings = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='mx-auto mt-4 flex max-w-screen-lg gap-4'>
      <div className='flex-1'>{children}</div>
    </div>
  )
}

export default LayoutSettings
