import React from 'react';
import { Typography, Container, makeStyles, Grid, Avatar, Link  } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = makeStyles((theme) => ({
  body:{
    height: 'calc(100vh - 94px)',
    [theme.breakpoints.down('md')]: {
      height: 'calc(100vh - 110px)',
    },
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 152px)',
    }
  },
  container:{
    height:'100%',
  },
  title:{
    marginBottom:theme.spacing(3),
    //fontSize:theme.typography.pxToRem(45),
    color:theme.palette.primary.main
  },
  subTitle:{
    marginBottom:theme.spacing(5),
    fontWeight:'bold',
    //fontSize:theme.typography.pxToRem(25),
  },
  aiLogo:{
    marginBottom:theme.spacing(3)
  },
  aoiLogo:{
    width:'600px',
    [theme.breakpoints.down('sm')]: {
      maxWidth:'450px',
      width:'100%'
    }
  },
  profile:{
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    '& > *': {
      margin: theme.spacing(1),
    },
    
  }

}));

const NotFoundPage = () => {
  const classes = useStyles();
  const { isAuthenticated, user, isLoading, loginWithRedirect, logout, error, getAccessTokenSilently} = useAuth0();
  const showProfile = (name) =>{
    return <Avatar className={classes.orange}>{name.substr(0,1).toUpperCase()}</Avatar>
  }
  return (
    <div>
      <Container maxWidth={'lg'} className={classes.body}>
        <Grid container alignItems="center" justify="flex-end" direction="row">
          <Typography variant="h5">Page Not Found</Typography>
          
        </Grid>
        
      </Container>
    </div>
  );
};

export default NotFoundPage;
