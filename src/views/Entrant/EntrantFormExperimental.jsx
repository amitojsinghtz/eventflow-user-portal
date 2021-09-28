import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import Form from '@rjsf/material-ui'
import { Typography, Container, Grid, Button } from '@material-ui/core'
import { entrantFactory, toast, formFactory } from '../../utils'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomFieldTemplate from '../../ui-component/CustomFieldTemplate'

const EntrantForm = (props) => {
  /**
   * Experimental storing component in string and replacing using custom
   * @pending convert custom component back to string form storing schema in DB
   * @method formFactory
   * @returns component
   */

  //simulate Base Form Schema Stored on backend

  const schema = JSON.stringify({
    title: "Entrant's Contact Details",
    description: 'Please enter all the fields marked with the asterisk (*).',
    type: 'object',
    properties: {
      description: {
        type: 'string',
      },
      phonePrefix: {
        customProp: 'regionalCodes',
        customPropType: 'flat',
        title: 'Phone Prefix',
      },
      phone: {
        type: 'number',
        title: 'Phone',
        maximum: 1000000000,
      },
      typeOfCompany: {
        title: 'Type of Company',
        type: 'string',
        customProp: 'companyTypes',
        customPropType: 'enum',
      },
    },
  })

  //simulate UI Schema stored on backend
  let uiSchema = JSON.stringify({
    description: { 'ui:widget': 'CustomTypography', variant: 'subtitle2' },
    phonePrefix: { xs: 5, md: 5 },
    phone: { xs: 7, md: 7 },
  })

  const { userAwardId, userId, setEntrantDetails } = props.flowStore
  const { getEntrantForm, entrantForm, addEntrantDetails, updateEntrantDetails } = props.entrantStore

  const [exampleTest, setExampleTest] = useState(formFactory.parseUIElements(uiSchema))

  const [exampleSchema, setExampleSchema] = useState(formFactory.parseBaseElements(schema))

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
    <Container maxWidth={'lg'}>
      <ToastContainer />
      <Grid>
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography variant="h4" gutterBottom>
            Demo
          </Typography>
          {entrantForm && (
            <>
              <Form
                schema={exampleSchema}
                uiSchema={exampleTest}
                formData={formData}
                onChange={console.log('changed')}
                onSubmit={console.log('')}
                onError={console.log('errors')}
                ObjectFieldTemplate={CustomFieldTemplate}
              >
                <div>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                  <Button type="button">Cancel</Button>
                </div>
              </Form>

              {/* <Form
                // schema={JSON.parse(entrantForm.baseSchema)}
                schema={base}
                uiSchema={uiSchema}
                //uiSchema={JSON.parse(entrantForm.uiSchema)}
                formData={entrantForm?.formData ? JSON.parse(entrantForm?.formData) : null}
                //formData={exampleTest}
                onChange={() => {
                  console.log('changed')
                }}
                onSubmit={handleSubmitData}
                onError={() => {
                  console.log('errors')
                }}
              >
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Form> */}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
  entrantStore: stores.store.entrantStore,
}))(observer(EntrantForm))
