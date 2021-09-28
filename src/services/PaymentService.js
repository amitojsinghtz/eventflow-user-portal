import { get, post } from "../utils/api";
import queryString from "query-string";

/**
 * Call get all entries
 * @returns {Promise<any>}
 */

export const updatePaymentIntent = async (params) => {
  const rep = await post(`/Payments/UpdatePaymentIntent`,params);
  return rep.data;
};

export const getPaymentIntent = async (params) => {
  const rep = await post(`/Payments/create-payment-intent`,params);
  return rep.data;
};

export const createOfflinePayment = async (params) => {
  const rep = await post(`/Payments/create-offline-payment`,params);
  return rep.data;
};

export const getPricingBySubmissionIds = async (params )=>{
  //const queryParams = queryString.stringify(params);
  const rep = await post(`/Pricing/GetPricingBySubmissionIds`,params);
  return rep.data;
}