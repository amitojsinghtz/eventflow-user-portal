import React, {useState, useEffect, Fragment} from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Container, makeStyles, Grid, Link, Button, Box, ButtonGroup, 
  IconButton, Checkbox
} from '@material-ui/core';import { Link as RLink, useParams } from 'react-router-dom';
import queryString from 'query-string';
import clsx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useAsyncHook, useCheckStep } from "../utils";
import { isEmpty, extractValues } from '../utils/Utils';
import { GetApp } from '@material-ui/icons';
//import { Layout } from "../layouts";
import { SystemProvider } from '../utils/SystemContext';
import { Loading, PopupModal, LoadingBackDrop} from '../components';
import Moment from 'react-moment';
import { forEach } from 'lodash';


const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
  },
  tableWrapper:{
    marginBottom:theme.spacing(2)
  },
  table: {
    minWidth: 650,
    
    '& th':{
      fontWeight:'600',
      //fontSize:theme.typography.pxToRem(13),
      padding:theme.spacing(1,2)
    },
    '& td':{
      //fontSize:theme.typography.pxToRem(13),
      padding:theme.spacing(1,2)
    }
  },
  tableTitle:{
    '& th':{
      fontWeight:'600',
    }
  },
  subTable:{
    width:'100%',
    backgroundColor:'#f5f5f5',
    '& th':{
      fontWeight:'600',
      //fontSize:theme.typography.pxToRem(12),
      padding:theme.spacing(1,2),
      color:'#505050'
    },
    '& td':{
      //fontSize:theme.typography.pxToRem(12),
      padding:theme.spacing(1,2),
      color:'#505050'
    }
  },
  checkbox:{
    '& .MuiSvgIcon-root':{
      color: theme.palette.primary.main
    }
  },
  editBtn:{
    color: theme.palette.success.light
  },
  viewBtn:{
    color: theme.palette.info.light
  },
  deleteBtn:{
    color: theme.palette.error.light
  },
  noDownload:{
    color:'#aaaaaa'
  }
}));

const RecordPage = (props) => {
  const {page} = queryString.parse(window.location.search);
  const classes = useStyles();
  const { isAuthenticated, user, isLoading } = useAuth0();

  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;
  const [resultReq, setResultReq] = useState(undefined);
  const [resultData, loadingResultData, resultKey] = useAsyncHook(resultReq);
  const [showLoading, setShowLoading] = useState(false);
  const [rows, setRows] = useState();
  const [userId, setUserId]  = useState();
  const [openPopup, setOpenPopup] = useState({open:false,title:'',content:''});
  const { entriesData, getEntriesData, paidSubmissionsData, getPaidSubmissionsData } = props.entryStore;

  useEffect(() => {
    const fn = async () => {
      if (!isLoading) {
        if(user)
          setUserId(user[namespace+'user_id']);
      }
    };
    fn();
  }, [isAuthenticated, isLoading]);
  useEffect(()=>{
    if(userId){
      getEntriesData({userId:userId});
      /* setResultReq({ 
        method: 'GET',
        authorized: false,
        url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Entry/GetAllEntriesByUserId?userId=${userId}`, 
        type: "application/json",
        key:'entry'
      }); */
    }
    
      
  },[userId])

  useEffect(()=>{
    if(entriesData){
      console.log(toJS(entriesData));
      setRows(toJS(entriesData));
    }
  },[entriesData]);

  const viewData = (data)=>{
    getPaidSubmissionsData({userId:userId});
    /* setResultReq({ 
      method: 'GET',
      authorized: false,
      url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Submission/GetSubmissionInCategoryNotSubmittedByUserId?userId=${userId}`, 
      type: "application/json",
      key:'submissions'
    }); */
    extractValues(['date','namecode','userid','aliascode','fileUpload'],data.answers);
  }
  const numWithCommas = (x)=>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const renderSubmission = (data,i)=>{
    return(
      
        <Table className={classes.subTable} key={`table-submission-${i}`}>
          <TableHead>
            <TableRow>
              <TableCell>Entry Id</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Submission Id</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Entries.map((row,j) => (
              <TableRow key={`entry-${j}`}>
                <TableCell>{row.EntryId}</TableCell>
                <TableCell>{row.CategoryName}</TableCell>
                <TableCell>{row.SubmissionId}</TableCell>
                <TableCell align="right">{row.Currency} {numWithCommas(row.Price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      
      
    );
  }

  console.log(rows);
  return (
    <SystemProvider value={{user:user}}>
        <div >
          <Container maxWidth={'lg'}>
            <div className={classes.root}>
              {rows?.length>0 ? (rows.map((row,i) => (
                  <TableContainer key={`table-${i}`} component={Paper} className={classes.tableWrapper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead key={`table-header`} className={classes.tableTitle}>
                        <TableRow>
                          <TableCell>Entry Id</TableCell>
                          <TableCell align="right">Date/Time</TableCell>
                          <TableCell align="right">Last Update</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Payment Type</TableCell>
                          <TableCell align="right">Status</TableCell>
                          <TableCell align="right">Invoice</TableCell>
                          <TableCell align="right">Recipt</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <Fragment key={`wrapper-${i}`}>
                        <TableRow key={`${row.pkEntryId}-${i}-entry`}>
                          <TableCell>{row.pkEntryId}</TableCell>
                          <TableCell align="right">
                            <Moment format="YYYY-MM-DD / hh:mm">{row.createdTime}</Moment>
                          </TableCell>
                          <TableCell align="right">
                            <Moment format="YYYY-MM-DD / hh:mm">{row.lastUpdatedTime}</Moment>
                          </TableCell>
                          <TableCell align="right">{row.currency} {numWithCommas(row.amount)}</TableCell>
                          <TableCell align="right">{row.paymentType}</TableCell>
                          <TableCell align="right">{row.paymentStatus}</TableCell>
                          {row.invoiceUrl ?
                            <TableCell align="center">
                              <a href={row.invoiceUrl} target="_blank"><GetApp fontSize="small"/></a></TableCell>
                            : <TableCell align="center" className={classes.noDownload}><GetApp fontSize="small"/></TableCell>
                          }
                          {row.invoiceUrl ?
                            <TableCell align="center">
                              <a href={row.receiptUrl} target="_blank"><GetApp fontSize="small"/></a></TableCell>
                            : <TableCell align="center" className={classes.noDownload}><GetApp fontSize="small"/></TableCell>
                          }
                          
                        </TableRow>
                        <TableRow key={`${row.pkEntryId}-${i}-submissions`}>
                          <TableCell colSpan="8"> 
                            {renderSubmission(row.listOfSubmissions,row.pkEntryId )}
                          </TableCell>
                        </TableRow>
                      </Fragment>
                      </TableBody>
                    </Table>
                  </TableContainer>
              ))) : (
                <Box mt={3}>
                  <Typography variant="h4" align="center">No submissions found</Typography>
                </Box>
              )}
            </div>
          </Container>
        </div>
      <PopupModal data={openPopup} />
      <LoadingBackDrop open={showLoading}/>
    </SystemProvider>
  );
  
};

export default inject((stores) => ({
  entryStore: stores.store.entryStore
}))(observer(RecordPage));
