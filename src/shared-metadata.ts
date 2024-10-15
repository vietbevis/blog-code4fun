import envConfig from './configs/envConfig'

export const baseOpenGraph = {
  type: 'website',
  siteName: 'Code4Fun',
  images: [
    {
      url: `${envConfig.NEXT_PUBLIC_API_URL}/logo.png`
    }
  ]
}
