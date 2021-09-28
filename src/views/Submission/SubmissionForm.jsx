import React, { useState } from 'react'
import Form from '@rjsf/material-ui'
import { Typography, Grid, Button, Box, Container } from '@material-ui/core'
import { IconChevronLeft } from '@tabler/icons'
import CustomFieldTemplate from '../../ui-component/CustomFieldTemplate'
import { formFactory } from '../../utils'

const SubmissionForm = (props) => {
  const formRef = React.useRef(null)

  const {
    userAwardId,
    userId,
    categoryData,
    submissionCategoryData,
    submissionData,
    submissionCategoryNames,
    submissionForm,
    entrantDetailsId,
  } = props

  const { status: formStatus = 'Draft' } = submissionForm

  const { saveSubmissionDetails, handleHideFormView, backHandler, mode = 'Add' } = props

  const [disableButton, setDisableButton] = useState(mode == 'View')

  const handleSubmitData = async (data) => {
    const { formData, status = formStatus } = data
    setDisableButton(true)
    const postBody =
      mode == 'Edit'
        ? {
            ...submissionForm,
            formData: JSON.stringify(formData),
            status,
          }
        : {
            ...submissionData,
            userId: userId,
            awardId: userAwardId.toString(),
            categoryId: submissionCategoryData?.category,
            baseSchema: submissionForm.baseSchema,
            uiSchema: submissionForm.uiSchema,
            formData: JSON.stringify(formData),
            createdBy: userId,
            updatedBy: userId,
            entrantDetailId: entrantDetailsId,
            status,
          }
    await saveSubmissionDetails(postBody)
    setDisableButton(false)
  }

  const handleSaveAsDraft = async () => {
    const { formData } = formRef.current.state
    await handleSubmitData({ formData })
  }

  const handleSaveForm = async (data) => {
    handleSubmitData({ formData: data.formData, status: 'Submitted' })
  }

  const validateFormData = (formData, errors) => {
    formFactory.validateFormData({ formState: formRef.current.state, errors })
    return errors
  }

  return (
    <Container maxWidth="sm">
      <Grid container direction="column" justify="center">
        {submissionCategoryNames && (
          <Box mb={4} mt={4}>
            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={backHandler}
                  startIcon={<IconChevronLeft strokeWidth={1} size={20} />}
                >
                  Back
                </Button>
              </Grid>
              <Grid item>
                <Typography variant="body1" gutterBottom align="right">
                  {`${submissionCategoryNames.region}  >  ${submissionCategoryNames.categoryType}  >  `}
                </Typography>
                <Typography variant="h5">{submissionCategoryNames.category}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {categoryData?.categoryName && (
          <>
            <Box mb={3}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Button
                    onClick={handleHideFormView}
                    size="small"
                    startIcon={<IconChevronLeft strokeWidth={1} size={20} />}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box mb={5}>
              <Typography variant="h4" gutterBottom align="center">
                {categoryData.categoryName}
              </Typography>
              <Typography variant="body1" gutterBottom align="center">
                {categoryData?.categoryNameCode || ''}
              </Typography>
            </Box>
          </>
        )}
        {submissionForm && (
          <>
            <Form
              schema={formFactory.parseBaseElements(submissionForm.baseSchema)}
              disabled={mode == 'View'}
              uiSchema={formFactory.parseUIElements(submissionForm.uiSchema)}
              formData={submissionForm.formData ? JSON.parse(submissionForm.formData) : null}
              validate={validateFormData}
              onChange={(data) => console.log('changed', data)}
              onSubmit={handleSaveForm}
              onError={() => console.log('errors')}
              ObjectFieldTemplate={CustomFieldTemplate}
              ref={formRef}
            >
              <Box mt={4}>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item>
                    <Button type="submit" variant="contained" disabled={disableButton}>
                      <Box pl={2} pr={2}>
                        Save
                      </Box>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={handleHideFormView}
                      variant="contained"
                      color="secondary"
                    >
                      Back
                    </Button>
                  </Grid>
                  {formStatus == 'Draft' && (
                    <Grid item>
                      <Button
                        type="button"
                        variant="outlined"
                        disabled={disableButton}
                        onClick={handleSaveAsDraft}
                      >
                        <Box pl={2} pr={2}>
                          Save As Draft
                        </Box>
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Form>
          </>
        )}
      </Grid>
    </Container>
  )
}

export default SubmissionForm
