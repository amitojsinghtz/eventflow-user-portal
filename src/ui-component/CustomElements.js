import React, { useState } from 'react'
import { postFileToS3 } from '../services/FormService'
import moment from 'moment'
import { Link, Button, Typography, Box, List, ListItem, ListItemIcon, Dialog, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { IconPoint, IconPaperclip } from '@tabler/icons'
import toastr from '../utils/toastr'

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
  line: {
    borderTop: '#ccc solid 1px',
  },
})

export const CustomTypography = (props) => {
  const { schema, uiSchema } = props
  const { variant, classes, color, gutterBottom, noWrap, component } = uiSchema
  return (
    <Typography
      variant={variant}
      classes={classes}
      color={color}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      component={component}
    >
      {schema.title}
    </Typography>
  )
}

export const CustomList = (props) => {
  const classes = useStyles()
  const { schema, uiSchema } = props
  const { dense, icon, variant } = uiSchema
  return (
    <div className={classes.root}>
      <Typography variant={variant} gutterBottom={true}>
        {schema.title}
      </Typography>
      <List dense={dense}>
        {schema.list.map((o, i) => (
          <ListItem key={i}>
            {icon && <ListItemIcon>{<IconPoint />}</ListItemIcon>}
            <Typography dangerouslySetInnerHTML={{ __html: o.primary }} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export const Break = (props) => {
  const classes = useStyles()
  return (
    <Box mt={3} mb={2}>
      <hr className={classes.line} />
    </Box>
  )
}

export const S3Uploader = (props) => {
  const { title, sizeMB = '15', validTypes = '["any"]', parseValidTypes = JSON.parse(validTypes) } = props.schema
  const [openDialog, setOpenDialog] = useState(false)
  const [fileType, setFileType] = useState(false)

  const validViewTypes = ['gif', 'png', 'jpeg']

  const handleViewFile = () => {
    if (validViewTypes.includes(fileType)) {
      return setOpenDialog(true)
    } else {
      window.open(props.value, '_blank').focus()
    }
  }

  const handleFileChange = async (e) => {
    //postFileToS3
    const file = e.target.files[0]
    if (file) {
      try {
        const fileType = file.name.split('.').pop()
        const filesize = (file.size / 1024 / 1024).toFixed(4)
        if (filesize > parseInt(sizeMB)) {
          toastr.error(`Max file size allowed: ${sizeMB}MB`)
          return
        } else if (!parseValidTypes.some((r) => ['any', fileType].indexOf(r) >= 0)) {
          toastr.error(`You can only upload ${parseValidTypes.join(', ')} files`)
          return
        }
        toastr.info('Processing your request', 'top-right', false)
        const fileUploadResponse = await postFileToS3(file)
        console.log(fileUploadResponse)
        props.onChange(fileUploadResponse)
        setFileType(fileType)
        toastr.dismissAll()
        toastr.success('File uploaded successfully!')
      } catch (error) {
        console.log(error)
        toastr.dismissAll()
        toastr.error("Couldn't upload file, please try again!")
      }
    }
  }

  return (
    <>
      <Box mb={1}>
        <Box mb={2}>
          <Typography gutterBottom>{title}</Typography>
        </Box>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Button variant="contained" color="secondary" component="label" size="small">
              Upload File
              <input type="file" onChange={handleFileChange} hidden></input>
            </Button>
          </Grid>

          {props.value && (
            <Grid item>
              <Link style={{ color: 'blue' }} onClick={() => handleViewFile(true)}>
                <IconPaperclip size={15} />
                View File
              </Link>
            </Grid>
          )}
        </Grid>
      </Box>
      <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <Box p={2}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <img style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 64px)' }} src={props.value} />
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}

export const FormattedDate = (props) => {
  const { date, format = 'YYYY-MM-DD HH:mm:ss' } = props

  if (!date) return <></>

  return <>{moment(date).format(format)} </>
}
