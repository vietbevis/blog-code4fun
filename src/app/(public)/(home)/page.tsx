import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'

import ROUTES from '@/constants/route'

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
      <Button>
        <Link href={ROUTES.LOGIN}>Login</Link>
      </Button>
      <Button>
        <Link href={ROUTES.REGISTER}>Register</Link>
      </Button>
      <p>hihi</p>
    </div>
  )
}
