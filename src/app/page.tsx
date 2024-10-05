import Image from 'next/image'

import { ModeToggle } from '@/components/ui/mode-toggle'

export default function Home() {
  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'>
      <Image
        src={'/logo.png'}
        alt='logo'
        width={480}
        height={480}
        className='h-auto w-14'
        quality={100}
        priority
      />
      <ModeToggle />
      <p>hihi</p>
    </div>
  )
}
