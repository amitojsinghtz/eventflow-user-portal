import React, { useState, useEffect } from 'react'
import { Grid, InputAdornment, Tooltip, IconButton } from '@material-ui/core'
import { FormInput, FormSelectInput, FormMultiSelectInput } from '../../ui-component/Input'
import { IconSearch, IconRefresh } from '@tabler/icons'
import { useTheme } from '@material-ui/core/styles'

const TransactionsSearchForm = (props) => {
  const theme = useTheme()
  const { transactionsSearch, categoryDropdownList, defaultAward, entrantDetailId, userId } = props

  const { setTransactionsSearch } = props

  const { searchBy = '', categoryList = '', status = '' } = transactionsSearch

  const [searchParams, setSearchParams] = useState({
    awardId: defaultAward.toString(),
    searchBy,
    categoryList: categoryList.split(', '),
    userId,
  })

  const [FindSearchValue, setFindSearchValue] = useState(searchParams.searchBy)

  const handleSearchChange = (fieldName, e) => {
    if (fieldName === 'searchBy') {
      if (e.key === 'Enter') {
        setSearchParams((prevSearchParams) => ({
          ...prevSearchParams,
          [fieldName]: FindSearchValue,
        }))
      }
    } else {
      setSearchParams((prevSearchParams) => ({
        ...prevSearchParams,
        [fieldName]: e.target.value,
      }))
    }
  }

  const handleReset = () => {
    setSearchParams({
      awardId: defaultAward,
      searchBy: '',
      categoryList: [],
      userId,
    })
    setFindSearchValue(null)
  }

  useEffect(() => {

    setTransactionsSearch({ ...searchParams, categoryList: searchParams.categoryList.join(',') })
    console.log('')
  }, [searchParams])

  return (
    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
      <Grid item xs={12} md={4}>
        <FormInput
          name="searchBy"
          label="Search"
          value={FindSearchValue}
          handleChange={(e) => setFindSearchValue(e.target.value)}
          shrink={true}
          fullWidth={true}
          KeyDown={(e) => handleSearchChange('searchBy', e)}
          InputProps={{
            label: 'Search',
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch stroke={1.5} size="1rem" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {/* <Grid item>
        <Grid container spacing={1} alignItems="center">
          <Grid item>Filtered By</Grid>
          <Grid item>
            <FormMultiSelectInput
              name="categoryList"
              label="Category"
              options={categoryDropdownList}
              values={searchParams}
              shrink="true"
              handleChange={(e) => handleSearchChange('categoryList', e)}
              idKey="name"
            />
          </Grid>
          <Grid item>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={handleReset}>
                <IconRefresh strokeWidth={1} size={20} color={theme.palette.purple.dark} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  )
}

export default TransactionsSearchForm
