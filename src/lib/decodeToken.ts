import { jwtDecode } from 'jwt-decode'

import AuthService from '@/services/auth.service'

import useAuthStore from '@/stores/auth.store'

import { TokenPayload } from '@/types/auth.type'

export const decodeToken = (token: string) => {
  return jwtDecode(token) as TokenPayload
}

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
  force?: boolean
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì sẽ có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const { token, login, logout } = useAuthStore.getState()
  const { accessToken, refreshToken } = token || {}

  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)

  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = Math.round(new Date().getTime() / 1000)
  // Trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    logout()
    return param?.onError && param.onError()
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (
    param?.force ||
    decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3
    // decodedAccessToken.exp - now < 3572 // test 10s gọi 1 lần
  ) {
    // Gọi API refresh token
    try {
      // Gọi API refresh token
      const result = await AuthService.refreshToken()
      login(result.payload)
      return param?.onSuccess && param.onSuccess()
    } catch (error) {
      console.log('🚀 ~ file: decodeToken.ts:53 ~ error:', error)
      return param?.onError && param.onError()
    }
  }
}
