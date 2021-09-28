import { runInAction, decorate, observable, action } from 'mobx'
import * as dropDownService from '../services/DropDownService'

class ObservableEntryStore {
  regions = undefined
  categoryTypes = undefined
  categories = undefined

  getRegionsByAwardAlias = async (params) => {
    try {
      const getRegionsByAwardAliasResponse = await dropDownService.getRegionsByAwardAlias(params)
      runInAction(() => {
        this.regions = getRegionsByAwardAliasResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.regions
  }


  ResetAll = async () => {
    try {
      runInAction(() => {
        this.regions = undefined
        this.categoryTypes = undefined
        this.categories = undefined
      })
    } catch (error) {
      console.log(error)
    }
    return [this.regions,this.categoryTypes,this.categories]
  }
  

  getCategoryTypesByRegion = async (params) => {
    try {
      const getCategoryTypesByRegionResponse = await dropDownService.getCategoryTypesByRegion(params)
      runInAction(() => {
        this.categoryTypes = getCategoryTypesByRegionResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.categoryTypes
  }

  getCategoriesByCategoryTypeAndRegion = async (params) => {
    try {
      const getCategoriesByCategoryTypeAndRegionResponse =
        await dropDownService.getCategoriesByRegionAndCategoryType(params)
      runInAction(() => {
        this.categories = getCategoriesByCategoryTypeAndRegionResponse
      })
    } catch (error) {
      console.log(error)
    }
    return this.categories
  }
}

decorate(ObservableEntryStore, {
  getRegionsByAwardAlias: action,
  ResetAll: action,
  regions: observable,
  getCategoryTypes: action,
  categoryTypes: observable,
  getCategoriesByCategoryTypeAndRegion: action,
  categories: observable,
})
export default new ObservableEntryStore()
