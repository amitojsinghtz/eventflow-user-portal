import * as api from '../utils/api'

export const postFileToS3 = async (file) => {
  const data = new FormData()
  data.append('file', file, file.name)
  const customHeaders = {
    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
  }
  const postFileToS3Response = await api.post(`/upload/Post`, data, customHeaders)
  return postFileToS3Response.data.data
}
