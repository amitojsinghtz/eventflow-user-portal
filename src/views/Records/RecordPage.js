import React, { useState, useEffect, Fragment } from 'react'
import { inject, observer } from 'mobx-react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Container,
  makeStyles,
  Grid,
  Link,
  Box,
  IconButton,
  Tooltip,
  TablePagination,
  Typography
} from '@material-ui/core'

import queryString from 'query-string'
import { IconSortAscending, IconSortDescending, IconList, IconDownload, IconEye } from '@tabler/icons'
import clsx from 'clsx'
import { Loading, PopupModal, LoadingBackDrop } from '../../components'
import Moment from 'react-moment'
import { useTheme } from '@material-ui/core/styles'
import SubmissionForm from '../Submission/SubmissionForm'
import StyledModal from '../../ui-component/modal'
import MainCard from '../../ui-component/cards/MainCard'

import { history } from '../../utils'

import TransactionsSearchForm from './TransactionsSearchForm'

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
  },
  tableWrapper: {
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,

    '& th': {
      fontWeight: '600',
      //fontSize:theme.typography.pxToRem(13),
      padding: theme.spacing(1, 2),
    },
    '& td': {
      //fontSize:theme.typography.pxToRem(13),
      padding: theme.spacing(1, 2),
    },
  },
  tableTitle: {
    '& th': {
      fontWeight: '600',
    },
  },
  subTable: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: '600',
      //fontSize:theme.typography.pxToRem(12),
      padding: theme.spacing(1, 2),
      color: '#505050',
    },
    '& td': {
      //fontSize:theme.typography.pxToRem(12),
      padding: theme.spacing(1, 2),
      color: '#505050',
    },
  },
  checkbox: {
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  editBtn: {
    color: theme.palette.success.light,
  },
  viewBtn: {
    color: theme.palette.info.light,
  },
  deleteBtn: {
    color: theme.palette.error.light,
  },
  noDownload: {
    color: '#aaaaaa',
  },
}))

const RecordPage = (props) => {
  const { categoryDropdownList, categoryDropdown } = props.categoryStore
  const { page } = queryString.parse(window.location.search)
  const classes = useStyles()
  const theme = useTheme()
  const [showLoader, setShowLoader] = useState(true)

  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE
  const [openPopup, setOpenPopup] = useState({ open: false, title: '', content: '' })
  const [showFormView, setShowFormView] = useState(false)
  const [formViewMode, setFormViewMode] = useState(false)
  const [categoryData, setCategoryData] = useState()
  const [selectedSubmission, setSelectedSubmission] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [showSubmissionsData, setShowSubmissions] = useState({})

  const {
    transactionsSearch,
    setTransactionsSearch,
    transactionsData,
    PageSize,
    PageNumber,
    TotalCount,
    OrderBy,
    SortOrder,
    setOrder,
    setPage,
  } = props.transactionsStore

  const { userAwardId, userId } = props.flowStore

  useEffect(() => {
    // categoryDropdown(userAwardId).then(() => setShowLoader(false))
  }, [])

  const handleActiveFormView = (view, submissionData) => {
    setCategoryData({ categoryName: submissionData.categoryName })
    setSelectedSubmission(submissionData)
    setFormViewMode(view)
    setShowFormView(true)
  }

  const handleHideFormView = (e) => {
    setSelectedSubmission(false)
    setShowFormView(false)
  }

  const handleHideModal = (e) => {
    setShowModal(false)
  }

  const numWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const renderSubmission = (data, i) => {
    return (
      <MainCard>
        <Table className={classes.subTable} key={`table-submission-${i}`}>
          <TableHead>
            <TableRow>
              <TableCell>Entry Id</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row, j) => (
              <TableRow key={`entry-${j}`}>
                <TableCell>{row.entryId}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell>{row.currency} {numWithCommas(row.price)}</TableCell>
                <TableCell>
                  <Moment format="YYYY-MM-DD / hh:mm">{row.createdAt}</Moment>
                </TableCell>
                <TableCell>
                  <Grid container spacing={0}>
                    <Grid item>
                      <Tooltip title="View Submission">
                        <IconButton size="small" onClick={() => history.push(`/submission/list?submissionId=${row.submissionId}`)}>
                          <IconEye strokeWidth={1} size={20} color={theme.palette.primary.main} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MainCard>
      
    )
  }
  const getFormView = () => {
    switch (formViewMode) {
      case 'View':
        return (
          <SubmissionForm
            submissionForm={selectedSubmission}
            submissionData={selectedSubmission}
            categoryData={categoryData}
            mode={formViewMode}
            handleHideFormView={handleHideFormView}
          />
        )
      default:
        setShowFormView(false)
        return
    }
  }

  return (
    <>
      {showFormView ? (
        <>{getFormView()}</>
      ) : (
        <>
          <MainCard>
            {showModal && (
              <StyledModal
                open={showModal}
                onClose={handleHideModal}
                aria-labelledby="View Submissions"
                width={1000}
                height='auto'
              >
                {renderSubmission(showSubmissionsData.data, showSubmissionsData.id)}
              </StyledModal>
            )}
            <Container maxWidth="0">
              <Box pt={1} pb={1}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Grid item xs={12}>
                    <TransactionsSearchForm
                      transactionsSearch={transactionsSearch}
                      setTransactionsSearch={setTransactionsSearch}
                      categoryDropdownList={categoryDropdownList}
                      defaultAward={userAwardId}
                      userId={userId}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Divider key={`divider-1`} />
              <div className={classes.root}>
                {transactionsData?.length>0 ? (
                    <TableContainer component={Paper} className={classes.tableWrapper}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead key={`table-header`} className={classes.tableTitle}>
                          <TableRow>
                            <TableCell>Transaction Id</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Date/Time</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell align="center">Invoice</TableCell>
                            <TableCell align="center">Receipt</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transactionsData.map((row, i) => (
                            <TableRow key={`${row.pkEntryId}-${i}-entry`}>
                              <TableCell>{row.pkTransactionId}</TableCell>
                              <TableCell key={`cell-email-${i}`} >
                                {row?.email}
                              </TableCell>
                              <TableCell>
                                <Moment format="YYYY-MM-DD / hh:mm">{row.createdTime}</Moment>
                              </TableCell>
                              <TableCell >
                                {row.fkCurrencyCode} {numWithCommas(row.amount)}
                              </TableCell>
                              <TableCell >{row.paymentType}</TableCell>
                              <TableCell >{row.paymentStatus}</TableCell>
                              <TableCell key={`cell-company-${i}`} >
                                {row?.company}
                              </TableCell>
                              <TableCell key={`cell-country-${i}`} >
                                {row?.country}
                              </TableCell>
                              <TableCell key={`cell-invoice-${i}`} align="center">
                                <Tooltip
                                  title={row?.invoiceUrl ? 'Dowload Invoice' : 'Invoice Not Available'}
                                >
                                  <Link
                                    href={row?.invoiceUrl ? row?.invoiceUrl.replace(/"/g, '') : ''}
                                    target="_blank"
                                  >
                                    <IconButton size="small">
                                      <IconDownload
                                        strokeWidth={1}
                                        size={20}
                                        color={
                                          row?.invoiceUrl
                                            ? theme.palette.primary.main
                                            : theme.palette.grey['700']
                                        }
                                      />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              </TableCell>
                              <TableCell key={`cell-receipt-${i}`} align="center">
                                <Tooltip
                                  title={row?.receiptUrl ? 'Dowload Receipt' : 'Receipt Not Available'}
                                >
                                  <Link
                                    href={row?.receiptUrl ? row?.receiptUrl.replace(/"/g, '') : ''}
                                    target="_blank"
                                  >
                                    <IconButton size="small">
                                      <IconDownload
                                        strokeWidth={1}
                                        size={20}
                                        color={
                                          row?.receiptUrl
                                            ? theme.palette.primary.main
                                            : theme.palette.grey['700']
                                        }
                                      />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              </TableCell>
                              <TableCell key={`cell-action-${i}`} align="center">
                                <Tooltip title={'View Submissions'}>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setShowSubmissions({ data: row?.entries, id: i })
                                      setShowModal(true)
                                    }}
                                  >
                                    <Box style={{ fontSize: '14px' }}>({row?.entries?.length}) </Box>
                                    <IconList strokeWidth={1} size={20} color={theme.palette.primary.main} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                ):(
                  <Box p={2}>
                    <Typography align="center">No results found</Typography>
                  </Box>
                )}
                {transactionsData?.length && (
                  <TablePagination
                    component="div"
                    nextIconButtonProps={{ size: 'small' }}
                    backIconButtonProps={{ size: 'small' }}
                    count={TotalCount}
                    rowsPerPageOptions={[]}
                    rowsPerPage={PageSize}
                    page={PageNumber - 1}
                    onPageChange={(event, pageNum) => {
                      setPage(pageNum + 1)
                    }}
                  />
                )}
              </div>
            </Container>
          </MainCard>
          <PopupModal data={openPopup} />
        </>
      )}
    </>
  )
}

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
  entryStore: stores.store.entryStore,
  transactionsStore: stores.store.transactionsStore,
  categoryStore: stores.store.categoryStore,
}))(observer(RecordPage))
