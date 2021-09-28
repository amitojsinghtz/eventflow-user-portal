import React from 'react';
import { makeStyles, Grid, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

}));

const Loading = (props) => {
  const classes = useStyles();
  return (
    <CircularProgress {...props}/>
  );
};

export default Loading;