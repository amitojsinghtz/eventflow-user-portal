import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import SubmissionForm from './SubmissionForm'
import {
  Typography,
  Grid,
  Divider,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  Box,
  Button,
  IconButton,
  TablePagination,
  Tooltip,
  Checkbox,
} from '@material-ui/core'
import MainCard from '../../ui-component/cards/MainCard'
import { useTheme } from '@material-ui/core/styles/'
import { history, toast } from '../../utils'
import { headCells, statusList } from './submissionHeadCells'
import { TableHead } from '../../ui-component/Table'
import { IconEye, IconEdit, IconPlus, IconTrash, IconShoppingCart } from '@tabler/icons'
import { updateSubmissionDetails } from '../../services/SubmissionService'
import { ToastContainer } from 'react-toastify'
import { PopupModal } from '../../components'
import Moment from 'react-moment'
import moment from 'moment'

const SubmissionsPage = (props) => {
  const submissionId = new URLSearchParams(window.location.search).get('submissionId')
  const theme = useTheme()
  const [showLoader, setShowLoader] = useState(true)
  const [selected, setSelected] = useState()

  const { userAwardId, userId, userAward ,entrantDetailsId } = props.flowStore
  {console.log("hagaji",props.flowStore)}

  const {
    submissionList,
    getSubmissions,
    PageSize,
    PageNumber,
    TotalCount,
    OrderBy,
    SortOrder,
    setPage,
    setOrder,
    deleteSubmissionDetails,
  } = props.submissionStore

  const { setCheckoutData, checkoutData  } = props.paymentStore

  const [selectedSubmission, setSelectedSubmission] = useState(false)
  const [showFormView, setShowFormView] = useState(false)
  const [formViewMode, setFormViewMode] = useState(false)
  const [categoryData, setCategoryData] = useState()
  const [openPopup, setOpenPopup] = useState({ open: false, title: '', content: '' })

  const getSubmissionFilters = () => {
    if (submissionId) return { facetFilters: { id: [submissionId] }}
    else
      return { facetFilters: {
        entrantDetailId: [entrantDetailsId],
        status: statusList,
        IsActive: ['true'],
      }
    }
  }

  const handleActiveFormView = (view, submissionData) => {
    setSelectedSubmission(submissionData)
    setCategoryData({
      awardName: submissionData.awardName,
      categoryNameCode: submissionData?.categoryNameCode,
      categoryName: submissionData?.categoryName,
    })
    setFormViewMode(view)
    setShowFormView(true)
  }

  const handleHideFormView = () => {
    setSelectedSubmission(false)
    setShowFormView(false)
  }

  const handleSubmissionSubmit = async (data) => {
    try {
      console.log(data)
      await updateSubmissionDetails(data)
      toast.success()
      getSubmissions(getSubmissionFilters())
      handleHideFormView()
    } catch (error) {
      toast.error()
    }
  }

  const handleCheckBoxChange = (e, index) => {
    setSelected((prevSelected) => {
      const tempPrevSelected = [...prevSelected],
        { checked } = e.target
      let indexOfLastChecked,
        j = tempPrevSelected.length - 1
      for (; j >= 0; j--) {
        if (tempPrevSelected[j].checked) {
          indexOfLastChecked = j
          break
        }

        const lastChecked = selected[indexOfLastChecked]
        tempPrevSelected[index].checked = checked
        if (e.shiftKey && checked && index > 0) {
          tempPrevSelected.map((x, i) => {
            if (i < index && (!lastChecked || i > indexOfLastChecked)) x.checked = true

            return x
          })
        }
        return tempPrevSelected
      }
    })
  }

  const selectedAll = (checked) => {
    setSelected((prevSelected) => [
      ...selected,
      prevSelected.map((x) => {
        x.checked = checked && x.status != 'Draft'
      }),
    ])
  }

  const deleteHandler = (id, name) => {
    setOpenPopup({
      open: true,
      title: 'Delete Submission',
      content: `Confirm to delete ${name} submission`,
      buttons: [
        <Button
          size="small"
          onClick={() => {
            deleteSubmissionDetails({ submissionDetailId: id }).then(() => {
              setOpenPopup({ open: false, title: '', content: '' })
              getSubmissions(getSubmissionFilters()).then(() => setShowLoader(false))
            })
          }}
          color={'primary'}
          variant="contained"
        >
          Confirm
        </Button>,
        <Button size="small" onClick={() => setOpenPopup({ ...openPopup, open: false })} variant="contained">
          Cancel
        </Button>,
      ],
    })
  }

  const compareDate = (start, end) => {
    if (moment().isSameOrAfter(moment(start)) && moment().isSameOrBefore(moment(end))) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    if (entrantDetailsId) {
      getSubmissions(getSubmissionFilters()).then(() => setShowLoader(false))
    }
  }, [entrantDetailsId])

  const getFormView = () => {
    switch (formViewMode) {
      case 'View':
        return (
          <SubmissionForm
            submissionForm={selectedSubmission}
            categoryData={categoryData}
            submissionData={selectedSubmission}
            mode={formViewMode}
            handleHideFormView={handleHideFormView}
          />
        )
      case 'Edit':
        return (
          <SubmissionForm
            submissionForm={selectedSubmission}
            categoryData={categoryData}
            saveSubmissionDetails={handleSubmissionSubmit}
            mode={formViewMode}
            handleHideFormView={handleHideFormView}
          />
        )
      default:
        setShowFormView(false)
        return
    }
  }

  useEffect(() => {
    if (submissionList?.length > 0) {
      const submissionItems = submissionList.map((x) => ({
        id: x.id,
        checked: checkoutData?.selectedIds.indexOf(x.id) > -1,
        status: x.status,
      }))
      setSelected(submissionItems)
    }
  }, [submissionList])

  useEffect(() => {
    setCheckoutData({
      selectedIds: selected?.length ? selected.filter((x) => x.checked).map((x) => x.id) : [],
    })
  }, [selected])

  return (
    <MainCard>
      <ToastContainer />
      {showFormView ? (
        <>{getFormView()}</>
      ) : (
        <>
          <Grid container alignItems="center" mb={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h2">
                Submissions
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h6">
                <Box display="flex" justifyContent="space-between">
                  <Box mr={2}>
                    {userAward && (
                      <Button
                        disabled={userAward.allowSubmission ? false : true}
                        variant="contained"
                        color={'primary'}
                        size="small"
                        onClick={() => history.replace('/submission/form')}
                        startIcon={<IconPlus strokeWidth={3} size={15} />}
                      >
                        Create Submission
                      </Button>
                    )}
                  </Box>
                </Box>
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          {console.log("submissionList :",submissionList)}
          {submissionList?.length > 0 && selected?.length > 0 ? (
            <>
              <TableContainer component={Paper} style={{ borderRadius: '0px' }}>
                <Table aria-label="simple table" className="table">
                  <TableHead
                    headCells={headCells}
                    OrderBy={OrderBy}
                    SortOrder={SortOrder}
                    selectedAll={selectedAll}
                    selectableCount={submissionList.some((x) => x.status != 'Draft')}
                    setOrder={(orderby, sortOrder) => setOrder(orderby, sortOrder, getSubmissionFilters())}
                  />
                  <TableBody>
                    {submissionList.map((data, index) => (
                      <TableRow key={`submission${index}`} style={{ cursor: 'pointer' }}>
                        <TableCell component="th" scope="row">
                          {data.status != 'Draft' && (
                            <Checkbox
                              checked={selected[index]?.checked || false}
                              onClick={(e) => handleCheckBoxChange(e, index)}
                            />
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {data.entryId}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {data.categoryName}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {data?.categoryNameCode}
                        </TableCell>
                        <TableCell>
                          <Moment format="YYYY-MM-DD HH:mm">{data?.createdAt}</Moment>
                        </TableCell>
                        <TableCell>{data?.name}</TableCell>
                        <TableCell>{data?.email}</TableCell>
                        <TableCell>{data.status}</TableCell>
                        <TableCell>
                          <Grid container spacing={0}>
                            <Grid item>
                              <Tooltip title="View Submission Details">
                                <IconButton size="small" onClick={() => handleActiveFormView('View', data)}>
                                  <IconEye strokeWidth={1} size={20} color={theme.palette.primary.main} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Tooltip title="Edit Submission">
                                <IconButton size="small" onClick={() => handleActiveFormView('Edit', data)}>
                                  <IconEdit strokeWidth={1} size={20} color={theme.palette.purple.dark} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Tooltip title="Delete Submission">
                                <IconButton
                                  size="small"
                                  onClick={() => deleteHandler(data.id, data.categoryName)}
                                >
                                  <IconTrash strokeWidth={1} size={20} color={theme.palette.error.main} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                nextIconButtonProps={{ size: 'small' }}
                backIconButtonProps={{ size: 'small' }}
                count={TotalCount}
                rowsPerPageOptions={[]}
                rowsPerPage={PageSize}
                page={PageNumber - 1}
                onPageChange={(event, pageNum) => setPage(pageNum + 1, getSubmissionFilters())}
              />
            </>
          ) : (
            <Box mt={3}>
              <Typography variant="h4" align="center">
                No submissions found
              </Typography>
            </Box>
          )}
          <Box mt={2} pb={3}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                {checkoutData?.selectedIds?.length > 0 && (
                  <Link to="/checkout">
                    <Button
                      startIcon={<IconShoppingCart strokeWidth={3} size={15} />}
                      variant="contained"
                      color="primary"
                    >
                      Checkout
                    </Button>
                  </Link>
                )}
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <PopupModal data={openPopup} />
    </MainCard>
  )
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
  submissionStore: stores.store.submissionStore,
  entrantStore: stores.store.entrantStore,
  paymentStore: stores.store.paymentStore,
}))(observer(SubmissionsPage))
