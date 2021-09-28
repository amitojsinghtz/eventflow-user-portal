import { runInAction, decorate, observable, action } from 'mobx'
import * as entrantService from '../services/EntrantService'

class ObservableEntrantStore {
  entrantForm = undefined
  addEntrantDetailsResponse = undefined

  getEntrantForm = async (params) => {
    try {
      const getEntrantFormResponse = await entrantService.getEntrantForm(params)
      runInAction(() => {
        this.entrantForm = getEntrantFormResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.entrantForm
  }

  addEntrantDetails = async (params) => {
    try {
      const addEntrantDetailsResponse = await entrantService.addEntrantDetails(params)
      runInAction(() => {
        this.addEntrantDetailsResponse = addEntrantDetailsResponse
      })
    } catch (error) {
      runInAction(() => {
        this.addEntrantDetailsResponse = error
      })
    } finally {
      return this.addEntrantDetailsResponse
    }
  }

  updateEntrantDetails = async (params) => {
    try {
      const updateEntrantDetailsResponse = await entrantService.updateEntrantDetails(params)
      runInAction(() => {
        this.entrantForm = updateEntrantDetailsResponse
      })
    } catch (error) {
      throw new Error(error.data.message)
    }
    return this.entrantForm
  }
}

decorate(ObservableEntrantStore, {
  getEntrantForm: action,
  entrantForm: observable,
  addEntrantForm: action,
  addEntrantDetails: action,
  addEntrantDetailsResponse: observable,
})
export default new ObservableEntrantStore()
