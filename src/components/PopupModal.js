import React, {useState, useEffect} from 'react';
import {Backdrop, DialogTitle,DialogContent,DialogActions,
  Dialog, Box, Grid, IconButton, Typography, withStyles, Alert, Button} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(2),
    minWidth:400
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

const MuiDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">{children}</Typography>
        </Grid>
        {onClose ? (
          <Grid item>
            <IconButton size="small" aria-label="close" className={classes.closeButton} onClick={onClose}>
              <Close />
            </IconButton>
          </Grid>
        ) : null}
      </Grid>
    </DialogTitle>
  );
});

const MuiDialogContent = withStyles((theme) => ({
  root: {
    // padding: theme.spacing(2),
  },
}))(DialogContent);

const MuiDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(1),
  },
}))(DialogActions);

export default function PopupModal(props) {
  const [open, setOpen] = useState(false);
  const [buttons, setButtons] = useState([]);
  const handleClose = () => setOpen(false);

  useEffect(()=>{
    setOpen(props.data.open);
    setButtons(props.data?.buttons || [<Button variant="contained" onClick={handleClose}>Close</Button>]);
  },[props])
  

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <MuiDialogTitle id="customized-dialog-title" onClose={handleClose}>
      {props.data.title}
      </MuiDialogTitle>
      <MuiDialogContent dividers>
        {props.data.severity ?
          <Box pt={2} pb={2}>
            <Alert variant="outlined" severity={props.data.severity}>
              {props.data.content}
            </Alert>
          </Box>
          :
          <Box pt={2} pb={2}>
            <Typography gutterBottom align="center">
              {props.data.content}
            </Typography>
          </Box>
        }
        
      </MuiDialogContent>
      <MuiDialogActions>
        <Grid container spacing={1} justifyContent="center">
          {buttons.map((b,i)=>{
              return (<Grid item key={i}>{b}</Grid>)
          })}
        </Grid>
      </MuiDialogActions>
    </Dialog>
  );
}
