import React from 'react'

const layout = async ({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: { slug: string }
}>) => {
  return (
    <>
      <h1 className='text-4xl font-bold'>{params.slug}</h1>
      {children}
    </>
  )
}

export default layout
