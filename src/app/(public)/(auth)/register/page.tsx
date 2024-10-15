import React from 'react'

import envConfig from '@/configs/envConfig'

import ROUTES from '@/constants/route'

import { baseOpenGraph } from '@/shared-metadata'

import FormRegister from './FormRegister'

export async function generateMetadata() {
  const url = envConfig.NEXT_PUBLIC_API_URL + ROUTES.REGISTER

  return {
    title: 'Register',
    description: 'Register an account',
    openGraph: {
      ...baseOpenGraph,
      title: 'Register',
      description: 'Register an account',
      url,
      images: [{ url: envConfig.NEXT_PUBLIC_API_URL + '/logo.png' }]
    },
    alternates: {
      canonical: url
    }
  }
}

const page = () => {
  return <FormRegister />
}

export default page
