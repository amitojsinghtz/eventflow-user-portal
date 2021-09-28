import { runInAction, decorate, observable, action } from 'mobx'
import * as categoryService from '../services/CategoryService'
class ObservableCategoryStore {
  categoryDropdownList = []

  categoryDropdown = async (awardId) => {
    try {
      const getAllCategorysResponse = await categoryService.categoryDropdown(awardId, { PageSize: 500 })
      runInAction(() => {
        this.categoryDropdownList = getAllCategorysResponse.data
      })
    } catch (err) {}
  }
}

decorate(ObservableCategoryStore, {
  categoryDropdownList: observable,
  categoryDropdown: action,
})
export default new ObservableCategoryStore()
