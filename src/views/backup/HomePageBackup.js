import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Loading, LoginButton } from '../components'
import { history } from '../utils'

const HomePage = (props) => {
  const userIdProp = `${process.env.REACT_APP_AUTHO_NAMESPACE}user_id`

  const { isAuthenticated, user, isLoading } = useAuth0()

  const {
    setUserAwardAlias,
    verifyEntrantDetails,
    entrantDetailsId,
    getAwardIdByAwardAlias,
    userId,
    setUserId,
  } = props.flowStore

  //Implement - Backend validation for awardId
  const { awardAlias } = useParams()

  const setUserState = async () => {
    await setUserId(user[userIdProp])
    await setUserAwardAlias(awardAlias)
    await getAwardIdByAwardAlias()
    await verifyEntrantDetails()
  }

  useEffect(() => {
    if (user) setUserState().then()
  }, [user])

  if (isLoading) return <Loading />

  if (!user || !userId || !isAuthenticated) return <LoginButton variant="contained" />

  if (entrantDetailsId) history.replace('/submission/list')

  if (!entrantDetailsId) history.replace('/entrant/form')
}

export default inject((stores) => ({
  stepStore: stores.store.stepStore,
  flowStore: stores.store.flowStore,
}))(observer(HomePage))
