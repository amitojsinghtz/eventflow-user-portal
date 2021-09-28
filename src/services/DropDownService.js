import { get } from '../utils/api'

export const getRegionsByAwardAlias = async (params) => {
  const getRegionsByAwardAliasResponse = await get(`/DropDownList/GetRegion`, params)
  return getRegionsByAwardAliasResponse.data
}

export const getCategoryTypesByRegion = async (params) => {
  const getCategoryTypesByRegionResponse = await get(`/DropDownList/GetCategoryTypeByRegion`, params)
  return getCategoryTypesByRegionResponse.data
}

export const getCategoriesByRegionAndCategoryType = async (params) => {
  const getCategoriesByRegionAndCategoryTypeResponse = await get(`/Category/GetAllCategoriesByRegionAndCategoryType`, params)
  return getCategoriesByRegionAndCategoryTypeResponse.data
}
