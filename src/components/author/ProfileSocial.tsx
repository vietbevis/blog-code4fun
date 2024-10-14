import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { AccountType } from '@/types/auth.type'

import { cn } from '@/lib/utils'

import { ButtonSocial } from '../buttons'
import Icon from '../ui/icon'

const ProfileSocial = ({
  profile: { profile },
  className,
  activeIcon = true
}: {
  profile: AccountType
  className?: string
  activeIcon?: boolean
}) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {profile?.bio && (
        <div className='flex items-center gap-4'>
          {activeIcon && <Image src={'/blockquote-icon.png'} alt='neo' width={24} height={24} />}
          <div>
            <p className='text-sm font-bold uppercase'>BIO</p>
            <p className='line-clamp-3 text-sm text-muted-foreground'>{profile?.bio}</p>
          </div>
        </div>
      )}
      {profile?.website && (
        <div className='flex items-center gap-4'>
          {activeIcon && <Icon name='Link' className='text-muted-foreground' />}
          <div>
            <p className='text-sm font-bold uppercase'>WEBSITE</p>
            <Link
              href={profile?.website}
              target='_blank'
              className='line-clamp-1 text-sm text-muted-foreground'
            >
              {profile?.website}
            </Link>
          </div>
        </div>
      )}
      {profile?.location && (
        <div className='flex items-center gap-4'>
          {activeIcon && <Image src={'/neo.png'} alt='neo' width={24} height={24} />}
          <div>
            <p className='text-sm font-bold uppercase'>LOCATION</p>
            <p className='line-clamp-1 text-sm text-muted-foreground'>{profile?.location}</p>
          </div>
        </div>
      )}
      <div className={`flex items-center justify-center gap-2`}>
        {profile?.social?.twitter && (
          <ButtonSocial
            url={profile?.social?.twitter}
            icon={
              <Icon
                name='Twitter'
                className='bi bi-instagram size-5 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500'
              />
            }
            title={'Twitter'}
          />
        )}
        {profile?.social?.linkedin && (
          <ButtonSocial
            url={profile?.social?.linkedin}
            icon={
              <Icon
                name='Linkedin'
                className='bi bi-instagram size-5 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500'
              />
            }
            title={'Linkedin'}
          />
        )}
        {profile?.social?.github && (
          <ButtonSocial
            url={profile?.social?.github}
            icon={
              <Icon
                name='Github'
                className='bi bi-instagram size-5 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500'
              />
            }
            title={'Github'}
          />
        )}
      </div>
    </div>
  )
}

export default ProfileSocial
