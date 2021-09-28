import { runInAction, decorate, observable, action } from "mobx";
import { updatePaymentIntent, getPaymentIntent, createOfflinePayment, getPricingBySubmissionIds } from "../services/PaymentService";

class ObservablePaymentStore {
  checkoutData = {selectedIds:[]};
  paymentIntentData = null;
  updatePaymentIntentResponse = null;
  createOfflinePaymentResponse = null;
  getPricingBySubmissionIdsResponse = null;

  getPaymentIntentData = async (params) => {
    try {
      const data = await getPaymentIntent(params);
      runInAction(() => {
        this.paymentIntentData = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
    return this.paymentIntentData;
  };

  updatePaymentIntentData = async (params) => {
    try {
      const data = await updatePaymentIntent(params);
      runInAction(() => {
        this.updatePaymentIntentResponse = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.updatePaymentIntentResponse = error;
      });
    }
    return this.cartData;
  };

  createOfflinePaymentData = async (params) => {
    try {
      const resp = await createOfflinePayment(params);
      runInAction(() => {
        this.createOfflinePaymentResponse = resp;
      });
    } catch (error) {
      console.log(error)
      this.createOfflinePaymentResponse = error;
    }
    return this.createOfflinePaymentResponse;
  };
  getPricingBySubmissionIds = async (params) => {
    try {
      const resp = await getPricingBySubmissionIds(params);
      runInAction(() => {
        this.getPricingBySubmissionIdsResponse = resp;
      });
    } catch (error) {
      console.log(error)
      this.getPricingBySubmissionIdsResponse = error;
    }
    return this.getPricingBySubmissionIdsResponse;
  };

  setCheckoutData = async (data) => {
    try {
      runInAction(() => {
        this.checkoutData = data
      })
    } catch (error) {
      console.log(error)
    }
    return this.checkoutData
  };

}

decorate(ObservablePaymentStore, {
  paymentIntentData: observable,
  updatePaymentIntentResponse: observable,
  createOfflinePaymentResponse: observable,
  getPricingBySubmissionIdsResponse: observable,
  checkoutData: observable,
  getPaymentIntentData: action,
  updatePaymentIntentData: action,
  createOfflinePaymentData: action,
  getPricingBySubmissionIds: action,
  setCheckoutData: action
});
export default new ObservablePaymentStore();
