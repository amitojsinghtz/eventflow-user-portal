import React, { useEffect, useState } from 'react'
import {Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react'
import Form from '@rjsf/material-ui'
import { Typography, Container, Grid, Button, Box } from '@material-ui/core'
import { entrantFactory, toast, formFactory } from '../../utils'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomFieldTemplate from '../../ui-component/CustomFieldTemplate'
import MainCard from '../../ui-component/cards/MainCard'

const EntrantForm = (props) => {

  const baseSchema = {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First name',
        default: 'Chuck',
      },
      email: {
        type: 'string',
        title: 'Email1',
        attributes: {
          identifier: 'email',
          validations: {
            unique: true,
            block: {
              list: 'gmail.com,yahoo.com,aol.com',
            },
          },
        },
      },
      email2: {
        type: 'string',
        title: 'Email2',
        attributes: {
          identifier: 'email',
          validations: {
            unique: true,
            block: {
              list: 'gmail.com,yahoo.com,aol.com',
            },
          },
        },
      },
      telephone: {
        type: 'string',
        title: 'Telephone',
        minLength: 10,
      },
    },
  }

  const uiSchema = {
    firstName: {
      'ui:autofocus': true,
      'ui:emptyValue': '',
      'ui:autocomplete': 'family-name',
    },
    email1: {
      'ui:emptyValue': '',
      'ui:autocomplete': 'given-name',
    },
    email2: {
      'ui:emptyValue': '',
      'ui:autocomplete': 'given-name',
    },
    age: {
      'ui:widget': 'updown',
      'ui:title': 'Age of person',
      'ui:description': '(earthian year)',
    },
    bio: {
      'ui:widget': 'textarea',
    },
    password: {
      'ui:widget': 'password',
      'ui:help': 'Hint: Make it strong!',
    },
    date: {
      'ui:widget': 'alt-datetime',
    },
    telephone: {
      'ui:options': {
        inputType: 'tel',
      },
    },
  }

  const { userAwardId, userId, setEntrantDetails } = props.flowStore
  const { getEntrantForm, entrantForm, addEntrantDetails, updateEntrantDetails } = props.entrantStore

  useEffect(() => {
    if (userId && userAwardId) getEntrantForm({ userId, awardId: userAwardId })
  }, [userId, userAwardId])

  const handleAddEntrantDetails = async (data) => {
    await addEntrantDetails(data).then((response) => setEntrantDetails(response.id))
  }

  const handleSubmitData = async (data) => {
    const commonFields = entrantFactory.mapCommonFields(data.formData)
    const postBody = {
      id: entrantForm.id,
      userId,
      awardId: userAwardId.toString(),
      baseSchema: entrantForm.baseSchema,
      uiSchema: entrantForm.uiSchema,
      formData: JSON.stringify(data.formData),
      createdBy: userId,
      updatedBy: userId,
      ...commonFields,
    }
    try {
      entrantForm.id ? await updateEntrantDetails(postBody) : await handleAddEntrantDetails(postBody)
      toast.success()
    } catch (error) {
      console.log(error)
      toast.error()
    }
  }
  const formData = {
    terms: true,
  }
  return (
    <MainCard>
      <ToastContainer />
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid container direction="column" justify="center" alignItems="center" style={{maxWidth: "80%"}}>
          {/* <Typography variant="h4" gutterBottom>
            Demo
          </Typography> */}
          {entrantForm && (
            <>
              <Form
                schema={formFactory.parseBaseElements(entrantForm.baseSchema)}
                uiSchema={formFactory.parseUIElements(entrantForm.uiSchema)}
                formData={entrantForm?.formData ? JSON.parse(entrantForm?.formData) : null}
                onChange={() => {
                  console.log('changed')
                }}
                onSubmit={handleSubmitData}
                onError={() => {
                  console.log('errors')
                }}
                ObjectFieldTemplate={CustomFieldTemplate}
              >
                <Box mt={4}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button type="submit" variant="contained" >
                        <Box pl={2} pr={2}>Save</Box>
                      </Button>
                    </Grid>
                    <Grid item>
                      <Link to="/">
                        <Button
                          type="submit"
                          variant="contained"
                          variant="contained"
                          color="secondary"
                        >
                          Back
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Form>
            </>
          )}
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
  entrantStore: stores.store.entrantStore,
}))(observer(EntrantForm))
