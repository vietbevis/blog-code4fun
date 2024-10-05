import AuthService from '@/services/auth.service'

import { RegisterBodyType } from '@/schemas'

import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBodyType
  try {
    const result = await AuthService.sRegister(body)
    return Response.json(result.payload)
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
