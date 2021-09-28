import { runInAction, decorate, observable, action } from "mobx";
import { getSubmissions, getUserProfile, deleteSubmission, getJotFormQuestions,
  updateSubmission, getPaidSubmissions, getEntriesByUserId } from "../services/EntryService";

class ObservableEntryStore {
  cartData = null;
  profileData = null;
  entriesData = null;
  jotFormQuestionsData = null;
  paidSubmissionsData = null;

  deleteSubmissionResponseData = null;
  updateSubmissionResponseData = null;

  getUserProfileData = async (params) => {
    try {
      const data = await getUserProfile(params);
      runInAction(() => {
        this.profileData = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
    return this.profileData;
  };

  getCartData = async (params) =>{
    try {
      const data = await getSubmissions(params);
      runInAction(() => {
        this.cartData = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
    return this.cartData;
  }

  updateSubmissionData = async (params) => {
    try {
      const data = await updateSubmission(params);
      runInAction(() => {
        this.updateSubmissionResponseData = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.updateSubmissionResponseData = error;
      });
    }
    return this.updateSubmissionResponseData;
  };

  deleteCartItem = async (id) => {
    try {
      const resp = await deleteSubmission({jotFormSubmissionId:id});
      runInAction(() => {
        this.deleteSubmissionResponseData = resp;
      });
    } catch (error) {
      console.log(error)
      this.deleteSubmissionResponseData = error;
    }
    return this.deleteAwardResponseData;
  };

  getPaidSubmissionsData = async (params) => {
    try {
      const data = await getPaidSubmissions(params);
      runInAction(() => {
        this.paidSubmissionsData = data;
      });
    } catch (error) {
      console.log(error)
    }
    return this.paidSubmissionsData;
  };

  getEntriesData = async (params) =>{
    try {
      const data = await getEntriesByUserId(params);
      runInAction(() => {
        this.entriesData = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
    return this.entriesData;
  }
  getJotFormQuestionsData = async (params)=>{
    
    try {
      const data = await getJotFormQuestions(params);
      runInAction(() => {
        this.jotFormQuestionsData = data;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
    return this.jotFormQuestionsData;
  }

}

decorate(ObservableEntryStore, {
  cartData: observable,
  deleteSubmissionResponseData: observable,
  updateSubmissionResponseData: observable,
  profileData: observable,
  paidSubmissionsData: observable, 
  entriesData: observable, 
  jotFormQuestionsData: observable,
  
  updateSubmissionData: action,
  deleteCartItem: action,
  getCartData: action, 
  getUserProfileData: action,
  getPaidSubmissionsData: action, 
  getEntriesData: action, 
  getJotFormQuestionsData: action
});
export default new ObservableEntryStore();
