import React, {useState} from 'react'
import { Formik } from 'formik'

import { FormSelectInput } from '../../ui-component/Input'
import { Grid, Typography, Divider, Box, Button } from '@material-ui/core'

const CategoryForm = (props) => {
  const {
    getCategoryTypes,
    getCategories,
    getSubmissionForm,
    handleFormSubmit,
    regions,
    categoryTypes,
    categories,
    awardAliasCode,
    submissionCategoryData,
    setSelections
  } = props

  const initialValues = {
    region: submissionCategoryData?.region || '',
    categoryType: submissionCategoryData?.categoryType || '',
    category: submissionCategoryData?.category || '',
  }

  const [names, setNames] = useState({region:'',categoryType:'',category:''});

  const handleDropDownChange = async (dropDownName, value, setFieldValue, values) => {
    setFieldValue(dropDownName, value)
    let params = {}, newNames = {...names};
    switch (dropDownName) {
      case 'region':
        params = { awardAliasCode, region: value }
        newNames = {...names, region:regions.find(o=>o.value===value).displayName}
        setFieldValue('categoryType', '')
        setFieldValue('category', '')
        await getCategoryTypes(params)
        break
      case 'categoryType':
        params = { region: values.region, categoryType: value }
        newNames = {...names, categoryType:categoryTypes.find(o=>o.value===value).displayName}
        setFieldValue('category', '')
        await getCategories(params)
        break
      case 'category':
        params = { categoryId: value }
        newNames = {...names, category:categories.find(o=>o.id===value).name}
        getSubmissionForm(params)
        break
      default:
        break
    }
    setNames(newNames);
    setSelections(newNames);

  }

  return (
    <Grid container spacing={5} direction="column" alignItems="center" justify="center">
      <Formik
        initialValues={initialValues}
        // validationSchema={EntrantFormFactorySchema}
        onSubmit={(values, { setSubmitting }) => {
          try {
            setSubmitting(true)
            handleFormSubmit(values)
          } catch (error) {
            setSubmitting(false)
          }
        }}
      >
        {(formProps) => {
          const { handleSubmit, isSubmitting, values, setFieldValue } = formProps
          return (
            <form onSubmit={handleSubmit} style={{ maxWidth: '450px' }}>
              <Grid container spacing={2} mt={5} mb={10}>
                <Grid item xs={12}>
                  <FormSelectInput
                    name="region"
                    label="Select Region"
                    fullWidth={true}
                    shrink={true}
                    style={{ minWidth: 450, maxWidth: 450 }}
                    options={regions}
                    idKey="value"
                    nameKey="displayName"
                    values={values}
                    handleChange={(e) =>
                      handleDropDownChange('region', e.target.value, setFieldValue, values)
                    }
                  />
                </Grid>
                {values.region && (
                  <>
                    <Grid item xs={12}>
                      <FormSelectInput
                        name="categoryType"
                        label="Select Category Type"
                        fullWidth={true}
                        shrink={true}
                        style={{ minWidth: 450, maxWidth: 450 }}
                        options={categoryTypes}
                        idKey="value"
                        nameKey="displayName"
                        values={values}
                        handleChange={(e) =>
                          handleDropDownChange('categoryType', e.target.value, setFieldValue, values)
                        }
                      />
                    </Grid>
                    {values.categoryType && (
                      <>
                        <Grid item xs={12}>
                          <FormSelectInput
                            name="category"
                            label="Select Category"
                            fullWidth={true}
                            shrink={true}
                            style={{ minWidth: 450, maxWidth: 450 }}
                            options={categories}
                            idKey="id"
                            nameKey="name"
                            values={values}
                            handleChange={(e) =>
                              handleDropDownChange('category', e.target.value, setFieldValue, values)
                            }
                          />
                        </Grid>
                        <Grid item xs={12} justifyContent="center">
                          <Button
                            className="btn btn-primary pr-5 pl-5 ml-2"
                            disabled={isSubmitting}
                            type="submit"
                            size="large"
                            variant="contained"
                          >
                            Start Submission
                          </Button>
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </form>
          )
        }}
      </Formik>
    </Grid>
  )
}

export default CategoryForm
