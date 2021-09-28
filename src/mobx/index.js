import ObservableStepStore from './StepStore'
import ObservableEntryStore from './EntryStore'
import ObservablePaymentStore from './PaymentStore'
import ObservableFlowStore from './FlowStore'
import ObservableEntrantStore from './EntrantStore'
import ObservableSubmissionStore from './SubmissionStore'
import ObservableDropDownStore from './DropDownStore'
import ObservableTransactionsStore from './TransactionsStore'
import ObservableCategoryStore from './CategoryStore'

class RootStore {
  constructor() {
    this.stepStore = ObservableStepStore
    this.entryStore = ObservableEntryStore
    this.paymentStore = ObservablePaymentStore
    this.flowStore = ObservableFlowStore
    this.entrantStore = ObservableEntrantStore
    this.submissionStore = ObservableSubmissionStore
    this.dropDownStore = ObservableDropDownStore
    this.transactionsStore = ObservableTransactionsStore
    this.categoryStore = ObservableCategoryStore
  }
}

export default RootStore
