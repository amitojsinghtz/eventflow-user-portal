import { runInAction, decorate, observable, action } from 'mobx'
import * as submissionService from '../services/SubmissionService'
import ObservableBaseClass from './Helper/StoreBase'
import { constants, storeUtils } from '../utils'

class ObservableTransactionsStore extends ObservableBaseClass {
  constructor() {
    super('name')
  }
  transactionsData = undefined
  transactionsSearch = {}
  PageSize = 50
  SortOrder = 'desc'
  OrderBy = 'pkTransactionId'

  setPage = async (page) => {
    await this.setBasePageProp(constants.pageConstants.page, page)
    await this.getTransactions()
  }

  setOrder = async (order, sort) => {
    await this.setBasePageProp(constants.pageConstants.order, order)
    await this.setBasePageProp(constants.pageConstants.sort, sort)
    await this.getTransactions()
  }

  setTransactionsSearch = async (params) => {
    try {
      runInAction(() => {
        this.transactionsSearch = { ...params }
        return this.getTransactions()
      })
    } catch (error) {
      console.log(error)
    }
  }

  getTransactionsQueryParams = async () => {
    return {
      ...this.getPagingParams(),
      ...storeUtils.mapQueryParams({ ...this.transactionsSearch, status: 'Submitted,Locked' }),
    }
  }

  getTransactions = async () => {
    try {
      const params = await this.getTransactionsQueryParams()
      console.log(params)
      const getTransactionReponse = await submissionService.getSubmissionsWithTransactionDetails(params)
      runInAction(() => {
        this.transactionsData = getTransactionReponse.data
        this.TotalCount = getTransactionReponse.pagination.TotalCount
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.transactionsData = []
      })
    }
    return this.transactionsData
  }
}

decorate(ObservableTransactionsStore, {
  setTransactionsSearch: action,
  transactionsSearch: observable,
  transactionsData: observable,
  getTransactions: action,
})
export default new ObservableTransactionsStore()
