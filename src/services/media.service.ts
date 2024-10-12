import { UploadFileResponseType } from '@/types/auth.type'

import ROUTES from '@/constants/route'

import http from '@/lib/http'

const UploadFilesService = {
  upload: (formData: FormData) =>
    http.post<UploadFileResponseType[]>(ROUTES.BACKEND.MEDIA_UPLOAD, formData)
}

export default UploadFilesService
