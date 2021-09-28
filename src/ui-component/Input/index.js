import React, { useState } from 'react'
import clsx from 'clsx'
import {
  FormControl,
  Select,
  Checkbox,
  FormHelperText,
  ListItemText,
  InputLabel,
  OutlinedInput,
  MenuItem,
  makeStyles,
  Button,
  Box,
  IconButton,
} from '@material-ui/core'

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import getBase64 from '../../utils/getBase64'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1, 0),
    minWidth: (props) => props.minWidth || 120,
    maxWidth: (props) => props.maxWidth || 400,
    borderRadius: '6px !important',
    '& label': {
      //lineHeight: "1rem",
      paddingLeft: '5px',
      paddingRight: '5px',
    },
    '& input': {
      borderRadius: '6px !important',
      background: '#fff',
    },
    '& fieldset': {
      borderRadius: '6px !important',
    },
  },
  fullWidth: {
    width: '100%',
  },
  normalWidth: {
    width: 'auto',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
  },
}))

export const FormInput = (props) => {
  const {
    name,
    inputType = 'text',
    required = false,
    placeholder,
    label,
    disabled,
    value,
    values,
    errors,
    handleChange,
    touched,
    handleBlur,
    inputProps,
    fullWidth,
    shrink,
    className,
    KeyDown
  } = props

  const classes = useStyles()
  //console.log(fullWidth, typeof(fullWidth), shrink,typeof(shrink));

  return (
    <>
      <FormControl
        variant="outlined"
        className={clsx({
          [className]: true,
          [classes.formControl]: true,
          [classes.fullWidth]: fullWidth,
          [classes.normalWidth]: !fullWidth,
        })}
      >
        <InputLabel shrink={shrink === 'true' || shrink || false} htmlFor="component-outlined">
          {label}
        </InputLabel>
        <OutlinedInput
          id={name}
          value={value ? value : values?.[name] || ''}
          onChange={handleChange}
          label={label}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          type={inputType}
          fullWidth={fullWidth || false}
          inputProps={inputProps}
          onKeyDown={KeyDown}
        />
        {errors && touched[name] && errors[name] && (
          <FormHelperText error={true}>{errors[name]}</FormHelperText>
        )}
      </FormControl>
    </>
  )
}

export const FormInputNumber = (props) => {
  const {
    name,
    inputType = 'number',
    required = false,
    placeholder,
    label,
    disabled,
    value,
    values,
    errors,
    handleChange,
    touched,
    handleBlur,
    inputProps,
    fullWidth,
    shrink,
    className,
  } = props

  const classes = useStyles()

  return (
    <>
      <FormControl
        variant="outlined"
        className={clsx({
          [className]: true,
          [classes.formControl]: true,
          [classes.fullWidth]: fullWidth,
          [classes.normalWidth]: !fullWidth,
        })}
      >
        <InputLabel shrink={shrink === 'true' || shrink || false} htmlFor="component-outlined">
          {label}
        </InputLabel>
        <OutlinedInput
          id={name}
          value={value ? value : values?.[name] || ''}
          onChange={handleChange}
          label={label}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          type={inputType}
          fullWidth={fullWidth || false}
        />
        {errors && touched[name] && errors[name] && (
          <FormHelperText error={true}>{errors[name]}</FormHelperText>
        )}
      </FormControl>
    </>
  )
}

export const FormInputDate = (props) => {
  const {
    name,
    inputType = 'datetime-local',
    required = false,
    placeholder,
    label,
    disabled = false,
    value,
    values,
    errors,
    handleChange,
    touched,
    handleBlur,
    InputProps,
    InputLabelProps,
    fullWidth,
    shrink,
    className,
  } = props

  //console.log(inputType,fullWidth, typeof(fullWidth), shrink,typeof(shrink));

  const classes = useStyles()
  return (
    <>
      <FormControl
        variant="outlined"
        className={clsx({
          [className]: true,
          [classes.formControl]: true,
          [classes.fullWidth]: fullWidth,
          [classes.normalWidth]: !fullWidth,
        })}
      >
        <InputLabel shrink={shrink === 'true' || shrink || false} htmlFor="component-outlined">
          {label}
        </InputLabel>
        <OutlinedInput
          id={name}
          value={value ? value : values?.[name] || ''}
          onChange={handleChange}
          label={label}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || ''}
          required={required}
          type={inputType}
          //inputlabelprops={InputLabelProps}
          fullWidth={fullWidth || false}
        />
        {errors && touched[name] && errors[name] && (
          <FormHelperText error={true}>{errors[name]}</FormHelperText>
        )}
      </FormControl>
    </>
  )
}

export const FormInputUploadImage = (props) => {
  const {
    name,
    required = false,
    placeholder,
    label = 'Upload logo',
    showImage = true,
    imageStyle = { width: '250px', height: '250px' },
    disabled,
    value,
    values,
    errors,
    handleChange,
    touched,
    handleBlur,
    setFieldValue,
    existingFileName,
    inputProps,
    fullWidth,
    className,
  } = props

  const [fileName, setFileName] = useState(existingFileName)

  const classes = useStyles()

  const handleFileChange = (e) => {
    const userFile = e.target.files[0]
    if (userFile) {
      if (userFile.size > 100000) {
        alert('Max file size allowed is 90kb')
        return
      }
      getBase64(e.target.files[0], (result) => {
        setFieldValue(name, result)
        setFileName(userFile.name)
      })
    } else {
      handleRemoveFile()
    }
  }

  const handleRemoveFile = () => {
    setFieldValue(name, '')
    setFileName('')
  }

  return (
    <>
      <FormControl
        variant="outlined"
        className={clsx({
          [className]: true,
          [classes.formControl]: true,
          [classes.fullWidth]: fullWidth === 'true',
          [classes.normalWidth]: !(fullWidth === 'true'),
        })}
      >
        {showImage && values[name] && (
          <Box pt={1} pb={1}>
            <img className="mt-3" src={values[name]} style={{ ...imageStyle }} />
          </Box>
        )}
        <Button variant="contained" color="secondary" component="label">
          {label}
          <input type="file" accept="image/png, image/jpeg" hidden onChange={handleFileChange} />
        </Button>
        {fileName && (
          <p className="mt-3">
            {' '}
            <IconButton aria-label="done" onClick={handleRemoveFile}>
              <DeleteOutlineIcon />
            </IconButton>
            {fileName}
          </p>
        )}
      </FormControl>
    </>
  )
}

export const FormSelectInput = (props) => {
  const {
    name,
    label,
    disabled,
    options = [],
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    inputProps,
    fullWidth,
    shrink,
    className,
    style,
    idKey = 'id',
    nameKey = 'name'
  } = props

  const classes = useStyles(style)
  //console.log(fullWidth, typeof(fullWidth), shrink,typeof(shrink));

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      className={clsx({
        [className]: true,
        [classes.formControl]: true,
        [classes.fullWidth]: fullWidth,
        [classes.normalWidth]: !fullWidth,
      })}
    >
      <InputLabel shrink={shrink === 'true' || shrink || false} id={`label-select${name}`}>
        {label}
      </InputLabel>
      <Select
        defaultValue=""
        labelId={`label-select${name}`}
        id={`select-outline${name}`}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ borderRadius: '0px' }}
      >
        {options.map((option) => (
          <MenuItem value={option[idKey]} key={`select-option-${name}-${option[idKey]}`}>
            {option[nameKey]}
          </MenuItem>
        ))}
      </Select>
      {errors && touched[name] && errors[name] && (
        <FormHelperText error={true}>{errors[name]}</FormHelperText>
      )}
    </FormControl>
  )
}

export const FormMultiSelectInput = (props) => {
  const {
    name,
    label,
    disabled,
    value,
    options = [],
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    inputProps,
    fullWidth,
    style,
    shrink,
    className,
  } = props

  const classes = useStyles(style)

  console.log(options, name, values[name])

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel shrink={shrink === 'true' || shrink || false} id={`label-select${name}`}>
        {label}
      </InputLabel>
      <Select
        labelId={`label-select${name}`}
        id={`select-outline${name}`}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ borderRadius: '0px' }}
        renderValue={(selected) => {
          let joinSelectedValues = ''
          if (selected) {
            selected.map((x) => {
              let findSelectedOption = options.find((o) => o.id == x)
              if (findSelectedOption) joinSelectedValues += `"${findSelectedOption.name}" `
            })
          }

          return joinSelectedValues
        }}
        multiple
        defaultValue=""
        // labelWidth={0}
        fullWidth={fullWidth}
      >
        {options.length &&
          options.map((option) => (
            <MenuItem value={option.id} key={`select-option-${name}-${option.id}`}>
              <Checkbox
                checked={values[name].indexOf(option.id) > -1}
                key={`select-check-${name}-${option.id}`}
              />
              <ListItemText primary={option.name} key={`select-listItem-${name}-${option.id}`} />
            </MenuItem>
          ))}
      </Select>
      {errors && touched[name] && errors[name] && (
        <FormHelperText error={true}>{errors[name]}</FormHelperText>
      )}
    </FormControl>
  )
}

export const FormCheckBoxInput = (props) => {
  const { name, label, disabled, placeholder, values, errors, touched, handleChange } = props

  return (
    <>
      <Checkbox
        disabled={disabled}
        checked={values[name]}
        name={name}
        onChange={handleChange}
      ></Checkbox>
      {label}
    </>
  )
}
