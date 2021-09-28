import { runInAction, decorate, observable, action } from 'mobx'
import * as submissionService from '../services/SubmissionService'
import ObservableBaseClass from './Helper/StoreBase'
import { pageConstants } from '../utils/constant'

class ObservableSubmissionStore extends ObservableBaseClass {
  constructor() {
    super('entryId')
  }
  formStep = 0
  submissionCategory = undefined
  submissionCategoryData = undefined
  addEntrantDetailsResponse = undefined
  deleteSubmissionDetailsData = undefined
  submissionsWithTransactionData = undefined
  submissionForm = undefined
  submissionList = undefined

  setPage = async (page, params) => {
    await this.setBasePageProp(pageConstants.page, page)
    await this.getSubmissions(params)
  }

  setOrder = async (order, sort, params) => {
    await this.setBasePageProp(pageConstants.order, order)
    await this.setBasePageProp(pageConstants.sort, sort)
    await this.getSubmissions(params)
  }

  getSubmissions = async (params) => {
    try {
      const requestParam = { ...this.getPagingParams(), ...params }
      const getSubmissionsResponse = await submissionService.getSubmissions(requestParam)
      runInAction(() => {
        this.submissionList = getSubmissionsResponse.data
        this.TotalCount = getSubmissionsResponse.pagination.TotalCount
      })
    } catch (error) {
      console.log(error)
    }
    return this.submissionList
  }

  getSubmissionForm = async (params) => {
    try {
      const getSubmissionFormResponse = await submissionService.getSubmissionForm(params)
      runInAction(() => {
        this.submissionForm = getSubmissionFormResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.submissionForm
  }

  addSubmissionDetails = async (params) => {
    try {
      const addSubmissionDetailsResponse = await submissionService.addSubmissionDetails(params)
      runInAction(() => {
        this.submissionDetails = addSubmissionDetailsResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.submissionDetails
  }

  updateSubmissionDetails = async (params) => {
    try {
      const updateSubmissionDetailsResponse = await submissionService.updateSubmissionDetails(params)
      runInAction(() => {
        this.submissionDetails = updateSubmissionDetailsResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.submissionDetails
  }

  deleteSubmissionDetails = async (params) => {
    try {
      const deleteSubmissionDetailsResponse = await submissionService.deleteSubmissionDetails(params)
      runInAction(() => {
        this.deleteSubmissionDetailsData = deleteSubmissionDetailsResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.deleteSubmissionDetailsData
  }

  getSubmissionsWithTransactionByUserIdDetails = async (params) =>{
    try {
      const getSubmissionsWithTransactionDetailsReponse = await submissionService.getSubmissionsWithTransactionByUserId(params)
      runInAction(() => {
        this.submissionsWithTransactionData = getSubmissionsWithTransactionDetailsReponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.submissionsWithTransactionData
  }
  

  setFormStep = async (step) => {
    try {
      runInAction(() => {
        this.formStep = step
      })
    } catch (error) {
      console.log(error)
    }
    return this.formStep
  }

  setSubmissionCategory = (categoryId) => {
    try {
      runInAction(() => {
        this.submissionCategory = categoryId
      })
    } catch (error) {
      console.log('@setSubmissionCategory', error)
    }
  }

  setSubmissionCategoryData = (params) => {
    try {
      runInAction(() => {
        this.submissionCategoryData = params
      })
    } catch (error) {
      console.log('@setSubmissionDategoryData', error)
    }
  }
  setSubmissionCategoryNames = (params) => {
    try {
      runInAction(() => {
        this.submissionCategoryNames = params
      })
    } catch (error) {
      console.log('@setSubmissionDategoryNames', error)
    }
  }
  
}

decorate(ObservableSubmissionStore, {
  getSubmissionForm: action,
  submissionForm: observable,
  addSubmissionDetails: action,
  submissionDetails: observable,
  setFormStep: action,
  formStep: observable,
  setSubmissionCategory: action,
  submissionCategory: observable,
  setSubmissionCategoryData: action,
  submissionCategoryData: observable,
  setSubmissionCategoryNames: action,
  submissionCategoryNames: observable,
  getSubmissions: action,
  submissionList: observable,
  updateSubmissionDetails:action, 
  submissionsWithTransactionData: observable, 
  getSubmissionsWithTransactionDetails: action, 
  deleteSubmissionDetails : action,
  deleteSubmissionDetailsData: observable
})
export default new ObservableSubmissionStore()
