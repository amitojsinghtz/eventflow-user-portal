import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { IconX } from '@tabler/icons'
import { Button, Grid, Typography, Box, Container } from '@material-ui/core'
import MainCard from '../cards/MainCard'

function getModalStyle() {
  const top = 48
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: (props) => props.width,
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    boxShadow: theme.shadows[5],
    borderRadius: '20px',
    overflow: (props) => props.height == 'auto' ? 'unset' : 'scroll',
    height: (props) => props.height,
  },

}))

export default function StyledModal(props) {
  const classes = useStyles({ width: props.width || 1000, height: props.height || 600 })
  const [modalStyle] = React.useState(getModalStyle)
  return (
    <Modal
      open={props.open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          props.onClose()
          // onClose(event, reason);
        }
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>      
        <div className="modal-close" style={{"margin":"17px 17px"}} onClick={props.onClose}>
          <IconX  strokeWidth={3} size={20} />        
        </div>
        {props.children}
      </div>
    </Modal>
  )
}

export const ConfirmationModal = (props) => {

  const { title, onConfirm, onCancel, sx } = props
  console.log(sx)
  return (
    <MainCard sx={sx || {}}>
      <Box mb={4}>
        <Typography variant="h3" m={2} gutterBottom>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item>
          <Button
            className="btn btn-primary pr-5 pl-5 ml-2"
            type="button"
            variant="contained"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item>
          <Button className="btn btn-outline-primary pr-5 pl-5 ml-2" type="button" onClick={onCancel}>
            Cancel
          </Button>

        </Grid>
      </Grid>
    </MainCard>
  )
}
