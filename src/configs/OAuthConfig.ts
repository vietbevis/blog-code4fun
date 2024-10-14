import envConfig from './envConfig'

export const OAuthConfig = {
  clientId: envConfig.NEXT_PUBLIC_CLIENT_ID,
  redirectUri: `${envConfig.NEXT_PUBLIC_API_URL}/authenticate`,
  authUri: envConfig.NEXT_PUBLIC_AUTH_URI
}
