import { get } from '../utils/api'

export const categoryDropdown = async (awardId, params) => {
  const getAllCategoryResponse = await get(`/Category/submissionform/${awardId}`, params)
  return getAllCategoryResponse
}
