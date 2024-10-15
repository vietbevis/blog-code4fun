import React from 'react'

import envConfig from '@/configs/envConfig'

import ROUTES from '@/constants/route'

import { baseOpenGraph } from '@/shared-metadata'

import FormLogin from './FormLogin'
import LogoutComponent from './logout'

export async function generateMetadata() {
  const url = envConfig.NEXT_PUBLIC_API_URL + ROUTES.LOGIN

  return {
    title: 'Login',
    description: 'Login to your account',
    openGraph: {
      ...baseOpenGraph,
      title: 'Login',
      description: 'Login to your account',
      url,
      images: [{ url: envConfig.NEXT_PUBLIC_API_URL + '/logo.png' }]
    },
    alternates: {
      canonical: url
    }
  }
}

const page = ({
  searchParams
}: {
  searchParams: {
    redirect?: string
    accessToken?: string
    refreshToken?: string
    [key: string]: string | undefined
  }
}) => {
  return (
    <>
      <FormLogin searchParams={searchParams} />
      <LogoutComponent searchParams={searchParams} />
    </>
  )
}

export default page
