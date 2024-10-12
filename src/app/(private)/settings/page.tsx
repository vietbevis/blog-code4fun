import { cookies } from 'next/headers'
import React from 'react'

import AccountService from '@/services/account.service'

import { EKeyToken } from '@/constants/enum'

import FormUpdateProfile from './FormUpdateProfile'

const ProfilePage = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get(EKeyToken.ACCESS_TOKEN)?.value || ''
  const { payload } = await AccountService.sGetAccount(accessToken)

  return (
    <div className='relative mb-10'>
      <FormUpdateProfile profile={payload.details} />
    </div>
  )
}

export default ProfilePage
