import { constants, localStore } from '../utils'

export const loadState = (state) => {
  try {
    state.flowStore.entrantDetailsId = localStore.get(constants.appConstants.USER_ENTRANT_DETAIL_ID)
    state.flowStore.userId = localStore.get(constants.appConstants.USER_ID)
    state.flowStore.userAward = localStore.get(constants.appConstants.USER_AWARD, true)
    state.flowStore.userAwardAlias = localStore.get(constants.appConstants.USER_AWARD_ALIAS)
    state.flowStore.userAwardId = localStore.get(constants.appConstants.USER_AWARD_ID, false, parseInt)
    console.log(
      'state.flowStore.userAward :',
      `${state.flowStore.userAward}   and ${localStore.get(constants.appConstants.USER_AWARD, true)}`
    )
    return state
  } catch (err) {
    console.log('** intial state load err *** /n', err)
    return state
  }
}
