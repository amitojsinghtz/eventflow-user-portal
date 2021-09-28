import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Form from '@rjsf/material-ui'
import { Grid, Button, Box, Container } from '@material-ui/core'
import { entrantFactory, toast, formFactory } from '../../utils'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomFieldTemplate from '../../ui-component/CustomFieldTemplate'
import MainCard from '../../ui-component/cards/MainCard'

const EntrantForm = (props) => {

  const formRef = useRef(null)

  const { userAwardId, userId, setEntrantDetails } = props.flowStore
  const { getEntrantForm, entrantForm, addEntrantDetails, updateEntrantDetails } = props.entrantStore

  useEffect(() => {
    if (userId && userAwardId) {
      getEntrantForm({ userId, awardId: userAwardId })
    }
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

  const validateFormData = (formData, errors) => {
    formFactory.validateFormData({ formState: formRef.current.state, errors })
    return errors
  }

  return (
    <MainCard>
      <ToastContainer />
      <Grid container justifyContent="center">
        <Container maxWidth="sm">
          <Grid container>
            {entrantForm && (
              <>
                <Form
                  schema={formFactory.parseBaseElements(entrantForm.baseSchema)}
                  uiSchema={formFactory.parseUIElements(entrantForm.uiSchema)}
                  formData={entrantForm?.formData ? JSON.parse(entrantForm?.formData) : null}
                  validate={validateFormData}
                  onChange={() => {
                    console.log('changed')
                  }}
                  onSubmit={handleSubmitData}
                  onError={() => {
                    console.log('errors')
                  }}
                  ObjectFieldTemplate={CustomFieldTemplate}
                  ref={formRef}
                >
                  <Box mt={4}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button type="submit" variant="contained">
                          <Box pl={2} pr={2}>
                            Save
                          </Box>
                        </Button>
                      </Grid>
                      <Grid item>
                        <Link to="/">
                          <Button type="submit" variant="contained" variant="contained" color="secondary">
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
        </Container>
      </Grid>
    </MainCard>
  )
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
  entrantStore: stores.store.entrantStore,
}))(observer(EntrantForm))
