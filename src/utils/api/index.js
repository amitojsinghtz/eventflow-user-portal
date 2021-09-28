import axios from 'axios/index'
import _ from 'lodash'
import { BASE_URL, USER_ID, AUTH_TOKEN } from '../constant/constant'
import { localStore } from '..'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const authHeader = () => {
  const token = localStore.get(AUTH_TOKEN)
  return { Authorization: `Bearer ${token}` }
}

const getHeaders = (customheaders) => {
  const headers = {
    ...defaultHeaders,
    'X-Authenticated-User': localStorage.getItem(USER_ID),
    ...customheaders,
    ...authHeader(),
  }
  return headers
}

const attachResponseHeaders = (response) => {
  const { 'x-pagination': pagination } = response.headers
  console.log(pagination)
  response.pagination = pagination ? JSON.parse(pagination) : undefined
  return response
}

const url = (path, params) => {
  const sections = path.split(':')
  const sectionsWithParams = sections.map((section) =>
    _.startsWith(section, '/') ? section : params[section]
  )
  const pathWithParams = sectionsWithParams.join('')
  return BASE_URL + pathWithParams
}

const apiService = axios.create({})

export const get = (path, params = {}) => apiService.get(url(path, params), { params, headers: getHeaders() })

export const post = (path, params = {}, customheaders = {}) =>
  apiService.post(url(path, params), params, { headers: getHeaders(customheaders) })

export const put = (path, params = {}) =>
  apiService.put(url(path, params), params, {
    headers: getHeaders(),
  })

export const deleteRequest = (path, params = {}) =>
  apiService.delete(url(path, params), { params, headers: getHeaders() })

apiService.interceptors.response.use(
  function (response) {
    attachResponseHeaders(response)
    return response
  },
  function (error) {
    console.log('++++', error)
    if (error.response && error.response.data && error.response.data.message) {
      console.log('++++', error)
    }
    return Promise.reject(error.response)
  }
)
