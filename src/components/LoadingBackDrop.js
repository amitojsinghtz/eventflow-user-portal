import React, {useState, useEffect} from 'react';
import {Backdrop, CircularProgress, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function LoadingBackdrop(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    setOpen(props.open)
  },[props])

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
