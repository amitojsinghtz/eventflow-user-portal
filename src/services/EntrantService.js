import * as api from '../utils/api'

export const getEntrantForm = async (params) => {
  const getEntrantFormResponse = await api.get(`/entrant/form`, params)
  return getEntrantFormResponse.data
}

export const addEntrantDetails = async (params) => {
  const addEntrantDetailsResponse = await api.post(`/entrant`, params)
  return addEntrantDetailsResponse.data
}

export const updateEntrantDetails = async (params) => {
  const updateEntrantDetailsResponse = await api.put(`/entrant/${params.id}`, params)
  return updateEntrantDetailsResponse.data
}

export const verifyEntrantDetails = async (params) => {
  const verifyEntrantDetailsResponse = await api.get(`/entrant/verify`, params)
  return verifyEntrantDetailsResponse.data
}

