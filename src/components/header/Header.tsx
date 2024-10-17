'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import useAuthStore from '@/stores/auth.store'
import useLoadingStore from '@/stores/loading'

import { useHeadroom } from '@/hooks/useHeadroom'
import { useMounted } from '@/hooks/useMounted'

import ROUTES from '@/constants/route'

import { cn } from '@/lib/utils'

import InputSearch from '../input-search'
import SidebarLeft from '../sidebars/SidebarLeft'
import { Button } from '../ui/button'
import Icon from '../ui/icon'
import { ModeToggle } from '../ui/mode-toggle'
import AvatarDropdown from './AvatarDropdown'

const headerStyles = {
  base: 'fixed inset-x-0 top-0 z-50 h-16 bg-card shadow transition-transform duration-300',
  pinned: 'translate-y-0',
  unpinned: '-translate-y-16'
}

const Header = React.memo(() => {
  const { isAuth } = useAuthStore()
  const pathname = usePathname()
  const mounted = useMounted()
  const pinned = useHeadroom({ fixedAt: 80 })
  const { isLoading } = useLoadingStore()

  const isLoginOrRegister = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER

  return (
    <header
      className={cn(
        headerStyles.base,
        pinned ? headerStyles.pinned : headerStyles.unpinned,
        isLoading && 'pointer-events-none'
      )}
    >
      <div className='container grid size-full grid-cols-2 items-center gap-2 md:grid-cols-4 md:gap-3'>
        <div className='flex items-center gap-1 md:gap-2'>
          <Sheet>
            <SheetTrigger asChild className='rounded-full md:hidden'>
              <Button variant={'outline'} size={'icon'} className='rounded-full'>
                <Icon name='AlignJustify' />
              </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className='h-dvh overflow-y-auto p-2'>
              <SheetHeader>
                <SheetTitle>Code4Fun.com</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <SidebarLeft />
            </SheetContent>
          </Sheet>

          <Link href={ROUTES.HOME} className='flex items-center gap-3'>
            <Image
              src={'/logo.png'}
              alt='logo'
              width={800}
              height={800}
              className='size-14'
              priority
              quality={100}
            />
            <h1 className='hidden text-2xl font-bold text-primary lg:block'>Code4Fun</h1>
          </Link>
        </div>

        <div className='col-span-2 mx-auto hidden w-full max-w-[31rem] md:block'>
          <InputSearch />
        </div>

        <div className='flex items-center justify-end gap-2 md:gap-3'>
          {mounted && (
            <>
              <InputSearch className='md:hidden' />
              <ModeToggle />
              {isAuth ? (
                <>
                  {/* <Button size='icon' variant='outline' className='shrink-0 rounded-full'>
                    <Icon name='Bell' className='size-5' />
                  </Button> */}
                  <AvatarDropdown />
                </>
              ) : (
                <Link
                  href={isLoginOrRegister ? ROUTES.HOME : ROUTES.LOGIN}
                  className='shrink-0 rounded-full'
                >
                  <Button className='w-24 shrink-0 rounded-full'>
                    {isLoginOrRegister ? 'Home' : 'Login'}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
