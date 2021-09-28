import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, Divider, Drawer, IconButton, List, ListItem, Grid,
  ListItemIcon, ListItemText, Typography, CssBaseline, AppBar, Toolbar
  } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { SystemContext } from "../utils/SystemContext";
import { Loading, LoginButton, LogoutButton} from '../components';
import clsx from 'clsx';

import { drawerWidth } from '../store/constant';

const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex'
  },
  appBar: {
      backgroundColor: theme.palette.background.default
  },
  appBarWidth: {
      transition: theme.transitions.create('width'),
      backgroundColor: theme.palette.background.default
  },
  content: {
      ...theme.typography.mainContent,
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
      }),
      [theme.breakpoints.up('md')]: {
          marginLeft: -(drawerWidth - 20),
          width: `calc(100% - ${drawerWidth}px)`
      },
      [theme.breakpoints.down('md')]: {
          marginLeft: '20px',
          width: `calc(100% - ${drawerWidth}px)`,
          padding: '16px'
      },
      [theme.breakpoints.down('sm')]: {
          marginLeft: '10px',
          width: `calc(100% - ${drawerWidth}px)`,
          padding: '16px',
          marginRight: '10px'
      }
  },
  contentShift: {
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0,
      [theme.breakpoints.down('md')]: {
          marginLeft: '20px'
      },
      [theme.breakpoints.down('sm')]: {
          marginLeft: '10px'
      }
  }
}));


const Layout = (props) => {
  const classes = useStyles();
  const {user, stepData} = useContext(SystemContext);
  //const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  console.log()

  const menu = [
    {text:'Entry Form', url:'/complete'}, 
    {text:'Entry Cart', url:'/cart'},
    {text:'Entry Records', url:'/records'}];

  const userMenu = [
    {text:'Profile', url:'/edit/profile/'}];

  const checkLocation = (url)=>{
    //console.log(window.location.href.indexOf(url));
    if(window.location.href.indexOf(url) > -1)
      return 'active';
    else
      return '';
  }
  //console.log(window.location);
  return(
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.titleText}>
            {stepData &&
              stepData.name
            }
            {props.pageName &&
              props.pageName
            }
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} >
        {/* <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div>
              <Grid container direction="row" justify="center" alignItems="center" className={classes.toolbar} >
                {user?
                  (
                    <Grid>
                      {user.nickname} <LogoutButton icon="true" size='small'/>
                    </Grid>
                  )
                  :(<LoginButton size='small'/>)
                }
              </Grid>
              <Divider />
              <List>
                {menu.map((item, index) => (
                  <ListItem button key={item.text} component={RLink} to={item.url}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={item.text} className={clsx(classes.menuText, checkLocation(item.url))}/>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {userMenu.map((item, index) => (
                  <ListItem button key={item.text} component={RLink} to={item.url}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={item.text} className={clsx(classes.menuText, checkLocation(item.url))}/>
                  </ListItem>
                ))}
              </List>
            </div>
          </Drawer>
        </Hidden> */}
      </nav>
      <main className={classes.contentContainer}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
  
  

};

export default Layout;