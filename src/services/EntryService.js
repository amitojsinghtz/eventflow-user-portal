import { get,deleteRequest, post } from "../utils/api";
import queryString from "query-string";

/**
 * Call get all entries
 * @returns {Promise<any>}
 */

 export const getUserProfile = async (params) => {
  const queryParams = queryString.stringify(params);
  const rep = await get(`/Submission/GetUserProfileByUserId?${queryParams}`);
  console.log(rep);
  return rep.data;
};

export const getSubmissions = async (params) => {
  const queryParams = queryString.stringify(params);
  console.log(queryParams);
  const rep = await get(`/Submission/GetSubmissionInCategoryNotSubmittedByUserId?${queryParams}`);
  console.log(rep);
  return rep.data;
};

export const updateSubmission = async (params) => {
  const queryParams = queryString.stringify(params);
  //console.log(queryParams);
  const rep = await post(`/Submission/UpdateJotFormSubmission`,params);
  console.log(rep);
  return rep.data;
};

export const deleteSubmission = async (params) => {
  const queryParams = queryString.stringify(params);
  console.log(queryParams);
  //console.log(queryParams);
  const rep = await get(`/Submission/DeleteSubmissionByjotFormSubmissionId?${queryParams}`);
  console.log(rep);
  return rep.data;
};

export const getEntriesByUserId = async (params) => {
  const queryParams = queryString.stringify(params);
  const rep = await get(`/Entry/GetAllEntriesByUserId?${queryParams}`);
  console.log(rep);
  return rep.data;
};

export const getPaidSubmissions = async (params) => {
  const queryParams = queryString.stringify(params);
  const rep = await get(`/Submission/GetSubmissionInCategoryNotSubmittedByUserId?${queryParams}`);
  console.log(rep);
  return rep.data;
};

export const getJotFormQuestions = async (params) => {
  const queryParams = queryString.stringify(params);
  const rep = await get(`/Submission/GetJotFormQuestions?${queryParams}`);
  console.log(rep);
  return rep.data;
};
