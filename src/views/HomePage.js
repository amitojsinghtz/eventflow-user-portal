import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { useParams, Redirect } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Loading, LoginButton, LoadingBackDrop } from '../components'
import Moment from 'react-moment'
import MainCard from '../ui-component/cards/MainCard'
import { history } from '../utils'
import { Grid, Typography, Box, Divider, Button, Card, CardMedia } from '@material-ui/core'
import { FormattedDate } from '../ui-component/CustomElements'
import IconNumberCard from '../ui-component/cards/IconNumberCard'
import { IconAward, IconWorld, IconClock } from '@tabler/icons'
import { useTheme } from '@material-ui/core/styles'
import moment from 'moment'

const HomePage = (props) => {
  const theme = useTheme()
  const userIdPath = `${process.env.REACT_APP_AUTHO_NAMESPACE}user_id`

  const { getAccessTokenSilently, user, isLoading } = useAuth0()

  const [pageLoading, setPageLoading] = useState(true)

  const {
    getAwardByAwardAlias,
    setUserAwardAlias,
    setUserId,
    getAwardAndEntrant,
    entrantDetailsId,
    userAward,
    setAuthToken,
  } = props.flowStore

  const { awardAlias } = useParams()
  const iconSize = '70'

  console.log('***Award Alias***HOME***', awardAlias, entrantDetailsId, userAward)

  const setUserState = async () => {
    if (user) {
      console.log('here')
      await setUserId(user[userIdPath])
      await setUserAwardAlias(awardAlias)
      await getAwardAndEntrant()
      getAccessTokenSilently().then((accessToken) => {
        setAuthToken(accessToken)
      })
      const token = await getAccessTokenSilently();
      console.log("HOME TOKEN SILENT ############################", token)
    }
  }
  useEffect(() => {
    if (!user && awardAlias) getAwardByAwardAlias(awardAlias)
  }, [user, awardAlias])

  useEffect(() => {
    if (!isLoading) setUserState().then(() => setPageLoading(false))
  }, [isLoading])

  if (isLoading || pageLoading) return <LoadingBackDrop />

  //if (!user || !userId || !isAuthenticated) return <LoginButton variant="contained" />
  if (!awardAlias && window.location.pathname === '/') return <Redirect to={`/AOY2021`} />

  return (
    <MainCard style={{ paddingBottom: '50px', paddingTop: '30px' }}>
      {userAward ? (
        <>
          <Box mb={4} alignContent="center" textAlign="center">
            <Typography variant="h2" mb={4}>
              {userAward.name}
            </Typography>
          </Box>

          <Box mb={4} alignContent="center" textAlign="center">
            <img src={userAward.logoURL} alt="award logo" />
            <Typography variant="h4">{userAward.info}</Typography>
          </Box>
          <Box mb={6}>
            <Grid container spacing={1} alignContent="center" justifyContent="center">
              <Grid item xs={2} align="center">
                <Grid container flexDirection="column">
                  <Grid item align="center">
                    <IconAward stroke={1} width={iconSize} height={iconSize} />
                  </Grid>
                  <Grid item align="center">
                    <Typography>{userAward.aliasCode}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} align="center">
                <Grid container flexDirection="column">
                  <Grid item align="center">
                    <IconWorld stroke={1} width={iconSize} height={iconSize} />
                  </Grid>
                  <Grid item align="center">
                    <Typography>{userAward.timeZone}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} align="center">
                <Grid container flexDirection="column">
                  <Grid item align="center">
                    <IconClock stroke={1} width={iconSize} height={iconSize} />
                  </Grid>
                  <Grid item align="center">
                    <Typography>
                      <Moment format="YYYY-MM-DD">{userAward.submissionStartTime}</Moment> to{' '}
                      <Moment format="YYYY-MM-DD">{userAward.submissionEndTime}</Moment>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {!user ? (
            <Grid container justifyContent="center">
              <Grid item xs={3} textAlign="center">
                <LoginButton text={'Login / Register'} path={`/${awardAlias}`} variant={'contained'} />
              </Grid>
            </Grid>
          ) : (
            <Grid container justifyContent="center">
              <Grid item xs={3} textAlign="center">
                {entrantDetailsId && (
                  <Button
                    onClick={() => history.push('/entrant/form')}
                    type="button"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    View Your Profile
                  </Button>
                )}
              </Grid>
              {console.log('entrantDetailsId :', entrantDetailsId)}
              {entrantDetailsId && (
                <Grid item xs={3} align="center">
                  <Button
                    onClick={() => history.push('/submission/form')}
                    type="button"
                    variant="contained"
                    color="secondary"
                    size="large"
                     disabled={ userAward?.allowSubmission ? false : true }
                  >
                    Start Submission
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </>
      ) : (
        <>No data found</>
      )}
    </MainCard>
  )
}

export default inject((stores) => ({
  stepStore: stores.store.stepStore,
  flowStore: stores.store.flowStore,
}))(observer(HomePage))
