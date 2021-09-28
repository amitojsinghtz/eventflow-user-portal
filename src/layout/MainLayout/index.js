import PropTypes from 'prop-types'
import React from 'react'
import { inject, observer } from 'mobx-react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
// material-ui
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AppBar, CssBaseline, Toolbar, useMediaQuery } from '@material-ui/core'

// third-party
import clsx from 'clsx'

// project imports
import Breadcrumbs from './../../ui-component/extended/Breadcrumbs'
import Header from './Header'
import Sidebar from './Sidebar'
//import Customization from './../Customization';
import navigation from './../../menu-items'
import { drawerWidth } from '../../store/constant'
import { SET_MENU } from './../../store/actions'
import Loader from '../../ui-component/Loader'

// assets
import { IconChevronRight } from '@tabler/icons'

// style constant
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
  },
  appBarWidth: {
    transition: theme.transitions.create('width'),
    backgroundColor: theme.palette.background.default,
  },
  content: {
    ...theme.typography.mainContent,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`,
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px',
      marginRight: '10px',
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
    },
  },
}))

//-----------------------|| MAIN LAYOUT ||-----------------------//

const MainLayout = ({flowStore, children }) => {
  const userIdPath = `${process.env.REACT_APP_AUTHO_NAMESPACE}user_id`
  const { setUserId, setAuthToken, getAwardAndEntrant } = flowStore
  const classes = useStyles()
  const { isAuthenticated, user, isLoading, getAccessTokenSilently  } = useAuth0()
  const theme = useTheme()
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened)
  const dispatch = useDispatch()
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened })
  }

  React.useEffect(() => {
    const openLeftDrawerState = (val) => {
      dispatch({ type: SET_MENU, opened: val })
    }
    openLeftDrawerState(matchUpMd)
  }, [dispatch, matchUpMd])

  React.useEffect(() => {
    if (!isLoading) {
      getAccessTokenSilently().then((accessToken) => {
        setAuthToken(accessToken)
      })
      setUserId(user ? user[userIdPath] : undefined).then(() => getAwardAndEntrant().then())
    }
  }, [isLoading])

  if (isLoading) return <Loader />

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        className={leftDrawerOpened ? classes.appBarWidth : classes.appBar}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>
      {isAuthenticated && <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />}
      <main
        className={clsx([
          classes.content,
          {
            [classes.contentShift]: leftDrawerOpened,
          },
        ])}
      >
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <div>{children}</div>
      </main>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
}))(observer(MainLayout))
