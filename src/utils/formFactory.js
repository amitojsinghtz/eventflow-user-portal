import { CustomTypography, CustomList, Break, S3Uploader } from '../ui-component/CustomElements'

import { regionalCodes } from '../assets/json/regionalCodes'
import { companyTypes } from '../assets/json/companyTypes'

const customPropTypeEnum = ['flat', 'enum']

const customElementsEnum = ['CustomTypography', 'CustomList', 'Break', 'S3Uploader']

const customElements = {
  CustomTypography,
  CustomList,
  Break,
  S3Uploader,
}

const customProp = {
  regionalCodes,
  companyTypes,
}

export const parseBaseElements = (baseSchema) => {
  const parsedJSONBase = JSON.parse(baseSchema)
  if (parsedJSONBase) {
    for (const property in parsedJSONBase.properties) {
      const hasCustomProp = customPropTypeEnum.find(
        (x) => x == parsedJSONBase.properties[property].customPropType
      )
      parsedJSONBase.properties[property] = setCustomProp(parsedJSONBase.properties[property], hasCustomProp)
    }
  }
  return parsedJSONBase
}

export const parseUIElements = (uiSchema) => {
  const parsedJSONUI = JSON.parse(uiSchema)
  if (parsedJSONUI) {
    for (const property in parsedJSONUI) {
      const isCustomElement = customElementsEnum.find((x) => x == parsedJSONUI[property]['ui:widget'])
      if (isCustomElement) parsedJSONUI[property]['ui:widget'] = customElements[isCustomElement]
    }
  }
  return parsedJSONUI
}

const setCustomProp = (propertyObj, propName) => {
  switch (propName) {
    case 'flat':
      return { ...customProp[propertyObj.customProp], ...propertyObj }
    case 'enum':
      return { ...propertyObj, enum: [...customProp[propertyObj.customProp]] }
    default:
      return propertyObj
  }
}

//Validation Functions
//Use to validate formData using in-line attributes

/**
 *
 * @param {object} paramObj formState and errors.
 * @param {string} paramObj.formState information about form.
 * @param {string} paramObj.formState.schema baseSchema of form.
 * @param {object} paramObj.formState.formData form data submitted by user
 * @param {object} paramObj.errors form Errors Object to update errors
 */

export const validateFormData = ({ formState, errors }) => {
  const { schema: baseSchema, formData } = formState
  try {
    for (const dataKey in formData) {
      const customValidations = getCustomPropValidations(baseSchema.properties[dataKey])
      for (const validation in customValidations) {
        try {
          const validatePropMethod = validatePropMethodMap[validation]
          if (validatePropMethod) validatePropMethod({ baseSchema, formData, dataKey })
        } catch (error) {
          if (error.isValidationErr) errors[dataKey].addError(error.message)
          console.log(`validateProp error -- validation:${validation} key:${dataKey} -->`, error)
        }
      }
    }
  } catch (error) {
    console.log('validateFormData error', error)
  }
  return errors
}

const getCustomPropValidations = (schemaProp) => {
  const hasCustomAttributes = schemaProp?.attributes
  if (hasCustomAttributes && hasCustomAttributes.identifier != 'file') return hasCustomAttributes.validations
  return undefined
}

const validateUniqueFormData = ({ baseSchema, formData, dataKey }) => {
  const { identifier } = baseSchema.properties[dataKey].attributes
  const duplicateProps = Object.keys(baseSchema.properties).find(
    (key) =>
      baseSchema.properties[key].attributes?.identifier == identifier &&
      key != dataKey &&
      formData[key] == formData[dataKey]
  )
  if (duplicateProps) throw new validationError('This field should be unique')
}

const validateBlockedFormData = ({ baseSchema, formData, dataKey }) => {
  console.log('validateBlockedFormData')
  const { attributes } = baseSchema.properties[dataKey]
  console.log('validateBlockedFormData', baseSchema.properties[dataKey], attributes)
  const { list, checkList = list.split(',') } = attributes.validations.block
  const data = formData[dataKey].toLowerCase()
  for (const item in checkList) {
    if (data.includes(checkList[item].toLowerCase())) throw new validationError(`${checkList[item]} is not allowed`)
  }
}

class validationError extends Error {
  constructor(message) {
    super()
    this.isValidationErr = true
    this.message = message
  }
}

const validatePropMethodMap = { unique: validateUniqueFormData, block: validateBlockedFormData }

//Not currently using but maybe useful going forward
const getBaseSchemaPropsArray = (baseSchemaProps) => {
  return Object.keys(baseSchemaProps).map((key) => ({
    name: key,
    data: baseSchemaProps[key],
  }))
}
