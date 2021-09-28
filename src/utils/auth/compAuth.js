// import React, { useState, useEffect } from 'react'
// import { inject, observer } from 'mobx-react'
// import { useAuth0 } from '@auth0/auth0-react'
// import { Loading, LoginButton } from '../../components'

// const compAuth = ({ component, ...args }) => {
//   const userIdPath = `${process.env.REACT_APP_AUTHO_NAMESPACE}user_id`

//   const { isAuthenticated, user, isLoading } = useAuth0()

//   const { setUserAwardAlias, setUserId } = props.flowStore

//   const setUserState = async () => {
//     await setUserId(user[userIdPath])
//     await setUserAwardAlias()
//   }

//   useEffect(() => {
//     if (user) setUserState().then()
//   }, [user])

//   if (isLoading) return <>Loading...</>

//   return <div></div>
// }

// export default inject((stores) => ({
//   flowStore: stores.store.flowStore,
// }))(observer(compAuth))
