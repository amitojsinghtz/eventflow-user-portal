import * as api from '../utils/api'

export const getSubmissionForm = async (params) => {
  const getSubmissionFormResponse = await api.get(`/submission/form`, params)
  return getSubmissionFormResponse.data
}

export const addSubmissionDetails = async (params) => {
  const addSubmissionDetailsResponse = await api.post(`/Submission/Submissiondetails`, params)
  return addSubmissionDetailsResponse.data
}

export const deleteSubmissionDetails = async (params) => {
  const deleteSubmissionDetailsResponse = await api.deleteRequest(`/Submission/Submissiondetails`, params)
  return deleteSubmissionDetailsResponse.data
}

export const getSubmissions = async (params) => {
  const getSubmissionsResponse = await api.get(`/Submission/Submissiondetails`, params)
  return getSubmissionsResponse
}
export const updateSubmissionDetails = async (params) => {
  const updateSubmissionDetailsResponse = await api.put(`/Submission/Submissiondetails/${params.id}`, params)
  return updateSubmissionDetailsResponse.data
}

export const getSubmissionsWithTransactionByUserId = async (params) =>{
  console.log(params)
  const getSubmissionsWithTransactionDetailsResponse = await api.get(`/Submission/transactions/users/${params.userId}`, params)
  return getSubmissionsWithTransactionDetailsResponse.data
}

export const getSubmissionsWithTransactionDetails = async (params) => {
  // const getSubmissionsWithTransactionDetailsResponse = await api.get(`/Submission/transactions/`, params)
  //transactions v2
  const getSubmissionsWithTransactionDetailsResponse = await api.get(`/Submission/v2/transactions`, params)
  return getSubmissionsWithTransactionDetailsResponse
}