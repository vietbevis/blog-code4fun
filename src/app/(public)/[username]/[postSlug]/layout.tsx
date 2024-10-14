import React from 'react'

const layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <div className='pb-20 pt-4 md:container sm:bg-background md:pb-4'>{children}</div>
}

export default layout
