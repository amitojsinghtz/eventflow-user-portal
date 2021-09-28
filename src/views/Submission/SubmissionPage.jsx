import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { useAuth0 } from '@auth0/auth0-react'
import CategoryForm from './CategoryForm'
import SubmissionForm from './SubmissionForm'
import { Stepper, Step, StepLabel, Typography, Box, Container } from '@material-ui/core'
import { Loading } from '../../components'
import MainCard from '../../ui-component/cards/MainCard'
import { history, toast } from '../../utils'
import { ToastContainer } from 'react-toastify'
import { Redirect }  from 'react-router-dom'
import { mapDetailFields } from '../../utils/entrantFactory'
import 'react-toastify/dist/ReactToastify.css'

const getFormSteps = () => {
  return ['Select Award Category', 'Add Submission']
}

const SubmissionPage = (props) => {
  const { isLoading } = useAuth0()
  const [names, setName] = useState();

  const { userAwardAlias, userId, userAwardId, userAwardName, entrantDetailsId } = props.flowStore
  const {
    setSubmissionCategoryData,
    setSubmissionCategoryNames,
    getSubmissionForm,
    submissionForm,
    setFormStep,
    formStep,
    submissionCategoryData,
    submissionCategoryNames,
    addSubmissionDetails,
  } = props.submissionStore

  const {
    getRegionsByAwardAlias,
    getCategoryTypesByRegion,
    getCategoriesByCategoryTypeAndRegion,
    regions,
    categoryTypes,
    categories,
    ResetAll,
  } = props.dropDownStore

  const { getEntrantForm, entrantForm } = props.entrantStore

  useEffect(() => {
    getRegionsByAwardAlias({ awardAliasCode: userAwardAlias })
  }, [])
  useEffect(()=>{
    console.log(submissionCategoryData);
  },[submissionCategoryData])

  useEffect(() => {
    ResetFormStep(0)
    ResetAll()
    if (userId && userAwardId) getEntrantForm({ userId, awardId: userAwardId })
  }, [userId, userAwardId])

  const steps = getFormSteps()

  const ResetFormStep  = (step) =>{
    setFormStep(step )
  }

  const handleCategorySubmit = (data) => {
    setSubmissionCategoryData(data)
    setFormStep(formStep + 1)
  }

  const handleCategoryNames = (data) =>{
    setSubmissionCategoryNames(data)
  }

  const handleSubmissionSubmit = async (data) => {
    console.log(data);
    try {
      await addSubmissionDetails(data)
      toast.success()
      history.replace('/submission/list')
      setFormStep(1);
    } catch (error) {
      toast.error()
    }
  }
  const backHandler =()=>{
    setSubmissionCategoryData()
    setSubmissionCategoryNames()
    setFormStep(formStep - 1)
  }

  const getStepContent = () => {
    switch (formStep) {
      case 0:
        return (
          <Box mt={4}>
            <CategoryForm
              getRegions={getRegionsByAwardAlias}
              getCategoryTypes={getCategoryTypesByRegion}
              getCategories={getCategoriesByCategoryTypeAndRegion}
              regions={regions}
              categoryTypes={categoryTypes}
              categories={categories}
              awardAliasCode={userAwardAlias}
              setSubmissionCategoryData={setSubmissionCategoryData}
              submissionCategoryData={submissionCategoryData}
              getSubmissionForm={getSubmissionForm}
              handleFormSubmit={handleCategorySubmit}
              setSelections={handleCategoryNames}
            />
          </Box>
        )
      case 1:
        //console.log(mapDetailFields(entrantForm?.formData));
        return (
          <SubmissionForm
            submissionCategoryData={submissionCategoryData}
            submissionForm={submissionForm}
            saveSubmissionDetails={handleSubmissionSubmit}
            userAwardId={userAwardId}
            submissionData = {{
              awardId:userAwardId, 
              awardName:userAwardName,
              name:entrantForm?.name ||'',
              email:entrantForm?.email ||'',
              country:mapDetailFields(JSON.parse(entrantForm?.formData)).country || '',
              company:mapDetailFields(JSON.parse(entrantForm?.formData)).company || '',
              categoryId:submissionCategoryData?.category||'',
              categoryName:submissionCategoryNames?.category||''
            }}
            userId={userId}
            submissionCategoryNames={submissionCategoryNames}
            entrantDetailsId={entrantDetailsId}
            backHandler={backHandler}
          />
        )
      default:
        return 'Unknown step'
    }
  }

  if (isLoading) return <Loading />

  if (!userAwardAlias || !userId || !userAwardId)
    return <Typography>User award authentication failure, please login again.</Typography>

  if (!entrantDetailsId)
    return <Redirect to={`/${userAwardAlias}`}/>
    //return <Typography>Please, fill entrant details in user profile before proceeding</Typography>

  return (
    <MainCard>
      <ToastContainer />
      <Container maxWidth="md">
        <Stepper activeStep={formStep}>
          {steps.map((label, index) => {
            const stepProps = {}
            const labelProps = {}
            return (
              <Step key={`matStep${index}`} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Container>
      {formStep === steps.length ? (
        <Typography className={classes.instructions}>All steps completed - you&apos;re finished</Typography>
      ) : (
        <>{getStepContent(formStep)}</>
      )}
    </MainCard>
  )
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
  entryStore: stores.store.entryStore,
  entrantStore: stores.store.entrantStore,
  submissionStore: stores.store.submissionStore,
  dropDownStore: stores.store.dropDownStore,
}))(observer(SubmissionPage))
