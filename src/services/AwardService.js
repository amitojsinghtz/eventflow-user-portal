import * as api from '../utils/api'

export const getAwardByAwardAlias = async (awardAlias) => {
  const getAwardByAwardAliasResponse = await api.get(`/Award/GetAwardByAliasCode?aliasCode=${awardAlias}`)
  return getAwardByAwardAliasResponse.data
}

export const getAwardIdByAwardAlias = async (awardAlias) => {
  const getAwardIdByAwardAliasResponse = await api.get(`/Award/GetAwardIdByAliasCode?aliasCode=${awardAlias}`)
  return getAwardIdByAwardAliasResponse.data
}

export const getAwardAndEntrant = async (params) => {
  const getAwardAndEntrantResponse = await api.get(`/Award/GetEntrantByAwardcode`, params)
  return getAwardAndEntrantResponse.data
}
