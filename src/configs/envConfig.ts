import { z } from 'zod'

const envConfigSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_API_IMAGE: z.string(),
  NEXT_PUBLIC_IMAGE_SIZE_MAX: z.number(),
  NEXT_PUBLIC_LEVEL_COMMENT_MAX: z.number(),
  NEXT_PUBLIC_CLIENT_ID: z.string(),
  NEXT_PUBLIC_AUTH_URI: z.string()
})

const configProject = envConfigSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_IMAGE: process.env.NEXT_PUBLIC_API_IMAGE,
  NEXT_PUBLIC_IMAGE_SIZE_MAX: Number(process.env.NEXT_PUBLIC_IMAGE_SIZE_MAX),
  NEXT_PUBLIC_LEVEL_COMMENT_MAX: Number(process.env.NEXT_PUBLIC_LEVEL_COMMENT_MAX),
  NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
  NEXT_PUBLIC_AUTH_URI: process.env.NEXT_PUBLIC_AUTH_URI
})

if (!configProject.success) {
  console.error(configProject.error.errors)
  throw new Error('Các khai báo biến môi trường không hợp lệ')
}

const envConfig = configProject.data
export default envConfig
