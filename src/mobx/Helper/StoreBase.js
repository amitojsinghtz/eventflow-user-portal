import { runInAction, decorate, observable, action } from 'mobx'

class ObservableBaseClass {
  constructor(column) {
    this.OrderBy = column
  }
  PageNumber = 1
  PageSize = 10
  TotalCount = 0
  SortOrder = 'asc'

  getPagingParams = () => ({
    PageNumber: this.PageNumber,
    PageSize: this.PageSize,
    OrderBy: this.OrderBy,
    SortOrder: this.SortOrder,
  })

  setBasePageProp = async (prop, value) => {
    runInAction(() => {
      this[prop] = value
    })
  }
}

decorate(ObservableBaseClass, {
  PageNumber: observable,
  PageSize: observable,
  TotalCount: observable,
  PageSize: observable,
  SortOrder: observable,
})

export default ObservableBaseClass
