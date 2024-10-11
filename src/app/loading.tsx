import React from 'react'

const Loading = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <div className='size-9 animate-spin rounded-full border-4 border-foreground border-y-transparent'></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loading
