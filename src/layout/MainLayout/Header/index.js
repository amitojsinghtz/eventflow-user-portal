import PropTypes from 'prop-types'
import React from 'react'
import { inject, observer } from 'mobx-react'
// material-ui
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Box, ButtonBase, Grid, Typography } from '@material-ui/core'

// project imports
import LogoSection from '../LogoSection'
import SearchSection from './SearchSection'
import LocalizationSection from './LocalizationSection'
import MobileSection from './MobileSection'
import ProfileSection from './ProfileSection'
import NotificationSection from './NotificationSection'
import FlipNunber from './FlipNumber'

// assets
import { IconMenu2 } from '@tabler/icons'

// style constant
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  headerAvatar: {
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    transition: 'all .2s ease-in-out',
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
    color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.dark,
    '&:hover': {
      background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.dark,
      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.secondary.light,
    },
  },
  boxContainer: {
    width: '228px',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      width: 'auto',
    },
  },
  Flipnumber: {
    marginLeft: '2em',
  },
}))

//-----------------------|| MAIN NAVBAR / HEADER ||-----------------------//

const Header = ({ handleLeftDrawerToggle, flowStore }) => {
  const { userAward } = flowStore

  const classes = useStyles()

  return (
    <React.Fragment>
      {/* logo & toggler button */}
      <div className={classes.boxContainer}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            className={classes.headerAvatar}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </div>
      {userAward && (
        <Grid container direction="row" justifyContent="space-between" alignItems="center" px={2}>
          <Box>
            <Typography ml={5}>{userAward.name}</Typography>
          </Box>
          <Box className={classes.Flipnumber}>
            {userAward.submissionCounter && (
              <FlipNunber title="Submission End Time" endTime={userAward.submissionEndTime}  startTime={userAward.submissionStartTime}/>
            )}
          </Box>
        </Grid>
      )}
      {/* header search */}
      {/*<SearchSection theme="light" />
            <div className={classes.grow} />
            <div className={classes.grow} />*/}
      <div className={classes.grow} />
      {/* live customization & localization  */}
      {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LocalizationSection />
            </Box>*/}

      {/* notification & profile 
            <NotificationSection />*/}
      <ProfileSection />

      {/* mobile header */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <MobileSection />
      </Box>
    </React.Fragment>
  )
}

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
}))(observer(Header))
