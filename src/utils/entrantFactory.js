export const mapCommonFields = (formData) => {
  try {
    return {
      name: getName(formData),
      email: getEmail(formData),
      company: getCompany(formData),
      country: getCountry(formData),
    }
  } catch (error) {
    return {}
  }
}

export const mapDetailFields = (formData) => {
  try {
    return {
      firstname: getFirstName(formData),
      lastname: getLastName(formData),
      email: getEmail(formData),
      line1: getLine1(formData),
      line2: getLine2(formData),
      city: getCity(formData),
      country: getCountry(formData),
      company: getCompany(formData),
      postalCode: getPostalCode(formData),
      state: getState(formData),
      phone: getPhone(formData),
      mobile: getMobilePhone(formData),
    }
  } catch (error) {
    return {}
  }
}

const getFirstName = (formData) => {
  try {
    return formData.firstName || '';
  } catch (error) {
    return null
  }
}
const getLastName = (formData) => {
  try {
    return formData.lastName || '';
  } catch (error) {
    return null
  }
}
const getName = (formData) => {
  try {
    return (
      formData.name ||
      formData.fullName ||
      (formData.firstName ? `${formData.firstName} ${formData.lastName}` : '')
    )
  } catch (error) {
    return null
  }
}

const getEmail = (formData) => {
  try {
    return formData.email || formData.workemail || formData.workEmail
  } catch (error) {
    return null
  }
}


const getCompany = (formData) => {
  try {
    return formData.company || formData.companyName
  } catch (error) {
    return null
  }
}

const getCountry = (formData) => {
  try {
    return formData.country || formData.region
  } catch (error) {
    return null
  }
}

const getLine1 = (formData) => {
  try {
    return formData.address1 || ''
  } catch (error) {
    return null
  }
}
const getLine2 = (formData) => {
  try {
    return formData.address2 || ''
  } catch (error) {
    return null
  }
}

const getCity = (formData) => {
  try {
    return formData.city || ''
  } catch (error) {
    return null
  }
}

const getMobilePhone = (formData) => {
  try {
    return `+${fromData.mobilePhonePrefix}-${formData.mobilePhone}` || ''
  } catch (error) {
    return null
  }
}

const getPhone = (formData) => {
  try {
    return `+${fromData.phonePrefix}-${formData.Phone}` || ''
  } catch (error) {
    return null
  }
}

const getPostalCode = (formData) => {
  try {
    return fromData.zipcode || ''
  } catch (error) {
    return null
  }
}

const getState = (formData) => {
  try {
    return fromData.state || ''
  } catch (error) {
    return null
  }
}

