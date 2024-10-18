import { useMutation } from '@tanstack/react-query'

import UploadFilesService from '../media.service'

const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: UploadFilesService.upload
  })
}

export default useUploadMediaMutation
