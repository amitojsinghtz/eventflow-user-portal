import { runInAction, decorate, observable, action } from 'mobx'
import * as entrantService from '../services/EntrantService'
import * as awardService from '../services/AwardService'
import { localStore, constants } from '../utils'
const { appConstants } = constants

class ObservableFlowStore {
  userAwardAlias = localStore.get(appConstants.USER_AWARD_ALIAS)
  userAwardId = localStore.get(appConstants.USER_AWARD_ID, false, parseInt)
  userId = localStore.get(appConstants.USER_ID)
  entrantDetailsId = localStore.get(appConstants.USER_ENTRANT_DETAIL_ID)
  userAward = localStore.get(appConstants.USER_AWARD, true)
  userAwardName = localStore.get(appConstants.USER_AWARD)
  userAwardInfo = localStore.get(appConstants.USER_AWARD_INFO)
  awardData = undefined
  AllSubmission = false

  /**
   *
   * @param string awardAlias
   * @param string userId
   * @returns awardAndEntrantId
   */
  getAwardAndEntrant = async () => {
    try {
      if (!this.userId || !this.userAwardAlias) throw new Error('User or Award not found')
      const getAwardAndEntrantResponse = await awardService.getAwardAndEntrant({
        aliasCode: this.userAwardAlias,
        userId: this.userId,
      })
      if (!getAwardAndEntrantResponse) throw new Error('No data from getAwardAndEntrant')
      this.setEntrantDetails(getAwardAndEntrantResponse.entrantId)
      this.setUserAward(getAwardAndEntrantResponse)
      // this.AllSubmission = getAwardAndEntrantResponse.isDefault;
      this.AllSubmission = false
    } catch (error) {
      this.setEntrantDetails(null)
      this.setUserAward(null)
      this.AllSubmission = null
      console.log('error getAwardAndEntrant', error)
    }
  }

  setUserAwardAlias = async (params) => {
    try {
      runInAction(() => {
        let userAward = localStore.get(appConstants.USER_AWARD_ALIAS)
        if (params && params.length) userAward = params
        if (userAward) {
          this.userAwardAlias = userAward
          localStorage.setItem(appConstants.USER_AWARD_ALIAS, userAward)
        } else {
          this.userAwardAlias = undefined
          localStorage.removeItem(appConstants.USER_AWARD_ALIAS)
        }
      })
    } catch (error) {
      console.log(error)
    }
    return this.userAwardAlias
  }

  verifyEntrantDetails = async () => {
    try {
      const params = { userId: this.userId, awardId: this.userAwardId }
      const verifyEntrantDetailsResponse = await entrantService.verifyEntrantDetails(params)
      runInAction(() => {
        this.entrantDetailsId = verifyEntrantDetailsResponse
        localStorage.setItem(appConstants.USER_ENTRANT_DETAIL_ID, verifyEntrantDetailsResponse)
      })
    } catch (error) {
      console.log(error)
    }
    return this.entrantDetailsId
  }

  setEntrantDetails = async (param) => {
    try {
      runInAction(() => {
        this.entrantDetailsId = param
        localStorage.setItem(appConstants.USER_ENTRANT_DETAIL_ID, param)
      })
    } catch (error) {
      console.log(error)
    }
    return this.entrantDetailsId
  }

  setUserId = async (userId) => {
    try {
      runInAction(() => {
        let localUserId = localStore.get(appConstants.USER_ID)
        if (userId) localUserId = userId
        this.userId = localUserId
        localStorage.setItem(appConstants.USER_ID, localUserId)
      })
    } catch (error) {
      console.log(error)
    }
    return this.userId
  }

  setUserAward = async (userAward) => {
    try {
      runInAction(() => {
        console.log('userAward', userAward)
        this.userAward = userAward
        localStorage.setItem(appConstants.USER_AWARD, JSON.stringify(userAward))
        this.userAwardId = parseInt(userAward.id)
        localStorage.setItem(appConstants.USER_AWARD_ID, userAward.id)
        this.userAwardAlias = userAward.aliasCode
        localStorage.setItem(appConstants.USER_AWARD_ALIAS, userAward.aliasCode)
        this.userAwardName = userAward.name
        localStorage.setItem(appConstants.USER_AWARD_NAME, userAward.name)
        this.userAwardInfo = userAward.info
        localStorage.setItem(appConstants.USER_AWARD_INFO, userAward.info)
        this.userAwardLogo = userAward.logo
        localStorage.setItem(appConstants.USER_AWARD_LOGO, userAward.logo)
      })
    } catch (error) {
      console.log(error)
    }
    return this.userAward
  }
  getAwardByAwardAlias = async (alias) => {
    try {
      const getAwardByAwardAliasResponse = await awardService.getAwardByAwardAlias(alias)
      runInAction(() => {
        this.userAward = getAwardByAwardAliasResponse
        localStorage.setItem(appConstants.USER_AWARD_ALIAS, getAwardByAwardAliasResponse.aliasCode)
      })
    } catch (error) {
      console.log(error)
    }
  }
  getAwardIdByAwardAlias = async () => {
    try {
      const getAwardIdByAwardAliasResponse = await awardService.getAwardIdByAwardAlias(this.userAwardAlias)
      runInAction(() => {
        this.userAwardId = getAwardIdByAwardAliasResponse
        localStorage.setItem(appConstants.USER_AWARD_ID, getAwardIdByAwardAliasResponse)
      })
    } catch (error) {
      console.log(error)
    }
  }

  getRequestParams = () => ({ user: this.userId, awardId: this.userAwardAlias })

  resetUserState = () => {
    try {
      runInAction(() => {
        localStorage.removeItem(appConstants.USER_ENTRANT_DETAIL_ID)
        this.entrantDetailsId = undefined
        localStorage.removeItem(appConstants.USER_ID)
        this.userId = undefined
      })
    } catch (error) {
      console.log('*** resetUserState', error)
    }
  }

  setAuthToken = (accessToken) => {
    try {
      runInAction(() => {
        localStorage.setItem(appConstants.AUTH_TOKEN, accessToken)
      })
    } catch (error) {
      console.log('*** resetUserState', error)
    }
  }
}

decorate(ObservableFlowStore, {
  getAwardIdByAwardAlias: action,
  userAwardId: observable,
  getRequestParams: action,
  setUserAwardAlias: action,
  resetUserState: action,
  userAwardAlias: observable,
  verifyEntrantDetails: action,
  getAwardByAwardAlias: action,
  setAuthToken: action,
  entrantDetailsId: observable,
  setUserId: action,
  userId: observable,
  userAward: observable,
  awardData: observable,
  AllSubmission: observable,
})
export default new ObservableFlowStore()
