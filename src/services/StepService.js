import { get,post } from "../utils/api";
import queryString from "query-string";

/**
 * Call get all entries
 * @returns {Promise<any>}
 */

 export const getStepData = async (params) => {
  const queryParams = queryString.stringify(params);
  console.log(queryParams);
  const stepRep = await get(`/Award/GetAwardStepNumberByAliasCode?${queryParams}`);
  const workRep = await get(`/Award/GetAwardByAliasCode?${queryParams}`);
  console.log(stepRep, workRep);
  return {stepData:stepRep.data, workData:workRep.data};
};