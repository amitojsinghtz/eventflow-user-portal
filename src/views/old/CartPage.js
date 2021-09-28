import React, {useState, useEffect} from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Container, makeStyles, Grid, Link, Button, Box, ButtonGroup, 
  IconButton, Checkbox
} from '@material-ui/core';
import { Link as RLink, useParams } from 'react-router-dom';
import queryString from 'query-string';
import clsx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useAsyncHook } from "../utils";
//import { Layout } from "../layouts";
import { SystemProvider } from '../utils/SystemContext';
import { Loading, PopupModal, LoadingBackDrop} from '../components';
import { CheckoutPage} from './';
import { isEmpty, extractValues } from '../utils/Utils';
import { Create, Visibility, Delete } from '@material-ui/icons';
import {loadStripe} from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
  },
  table: {
    minWidth: 650,
    '& th':{
      fontWeight:'600',
      //fontSize:theme.typography.pxToRem(12),
      padding:theme.spacing(1,2)
    },
    '& td':{
      //fontSize:theme.typography.pxToRem(12),
      padding:theme.spacing(1,2)
    }
  },
  tableTitle:{
    '& th':{
      fontWeight:'600'
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
  }
}));


const CartPage = (props) => {
  const parsed = queryString.parse(window.location.search);
  const classes = useStyles();
  const { isAuthenticated, user, isLoading } = useAuth0();
  const { cartData, getCartData, deleteSubmissionResponseData, deleteCartItem, updateSubmissionData, updateSubmissionResponseData} = props.entryStore;

  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;
  const submissionid = parsed.jotFormSubmissionId || null;

  const [rows, setRows] = useState();
  const [selected, setSelected] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState([]);
  const [entryIds, setEntryIds] = useState([]);
  const [userId, setUserId]  = useState();
  const [checkout, setCheckout]  = useState(false);
  const [openPopup, setOpenPopup] = useState({open:false,title:'',content:''});
  const [showLoading, setShowLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [viewItems, setViewItems] = useState([]);
  const [reload, setReload] = useState(true);
  let { method } = useParams();

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
    if(method==='alipay'){
      setCheckout(true);
    }
  },[method])

  useEffect(()=>{
    console.log(submissionid, userId, reload);
    
    if(userId){
      if(submissionid){
        //{returnurl}?userId={userid}&aliasCode={aliascode}&jotFormSubmissionId={id}&categoryNameCode={namecode}&autoGenId={autogenid}
        //userId=auth0%7C606ebe5b19cbd8006889f339&aliasCode=AOY2021&jotFormSubmissionId=4959266189614776846&categoryNameCode=SA09.&autoGenId=888092
        updateSubmissionData(parsed);
      }else
        getCartData({userId:userId});
    }
    
  },[userId]);

  useEffect(()=>{
    if(updateSubmissionResponseData || deleteSubmissionResponseData){
      setReload(false);
      getCartData({userId:userId});
    }
  },[updateSubmissionResponseData,deleteSubmissionResponseData]);

  useEffect(()=>{
    if(deleteId){
      setShowLoading(true);
      deleteCartItem(deleteId);
    }
  },[deleteId])

  useEffect(()=>{
    if(cartData){
      console.log(toJS(cartData));
      setRows(cartData);
      let items = {};
      cartData.forEach(o=>{
        items = {...items,[o.id]:false}
      })
      setSelected(items);
    }
  },[cartData]);


  const handleChange =(id) =>{
    console.log(rows);
    let _selectedIds = [...selectedIds], index = _selectedIds.indexOf(id), 
        _submissionsIds = [...selectedSubmissionIds],
        _entryIds = [...entryIds];
    let _selectedItem = rows.find(o=>{return(o.id===id)});
    setSelected({...selected, [id]:!selected[id]});
    
    if (index > -1) {
      _selectedIds.splice(index, 1);
      _submissionsIds.splice(index, 1);
      _entryIds.splice(index, 1);
    }else{
      _selectedIds.push(id);
      _submissionsIds.push(_selectedItem.jotFormSubmissionId);
      _entryIds.push(_selectedItem.entryId);
    }
    setSelectedIds(_selectedIds);
    setSelectedSubmissionIds(_submissionsIds);
    setEntryIds(_entryIds);
  }
  const displayCheckout = () =>{
    setCheckout(!checkout);
  }
  const confirmDelete = (id)=>{
    //setShowLoading(true);
    setOpenPopup({...openPopup,open:false});
    setDeleteId(id);
  }
  const paymentComplete = (result)=>{
    setOpenPopup({
      open:true,
      title:"Payment Completed", 
      content:`Thank you for the ${result.methodName} Payment`
    });
    setCheckout(false);
    setReload(true);
  }

  const deleteHandler =(id) =>{
    setOpenPopup({
      open:true,
      title:'Delete Submission',
      content:`Confirm to delete ${id} submission`, 
      buttons:[
        <Button size="small" onClick={()=>confirmDelete(id)}color={'primary'} variant='contained'>Confirm</Button>, 
        <Button size="small" onClick={()=>setOpenPopup({...openPopup,open:false})} variant='contained'>Cancel</Button>
      ]
    });
  }

  const viewData = (data)=>{
    console.log(data);
    extractValues(['date','namecode','userid','aliascode','fileUpload'],data.answers);
  }
  
  if(checkout){
    return (
      <Elements stripe={stripePromise}>
        <SystemProvider value={{user:user}}>
            <div >
              <Container maxWidth={'lg'}>
                <Paper elevation={3}>
                  <CheckoutPage onPaymentComplete={paymentComplete} method={method} selectedIds={selectedSubmissionIds} entryIds={entryIds} user={user} closeCheckout={displayCheckout}/>
                </Paper>
              </Container>
            </div>
        </SystemProvider>
      </Elements>
    );
  }else{
    return (
      <SystemProvider value={{user:user}}>
          <div >
            <Container maxWidth={'lg'}>
              
              <div className={classes.root}>
                <Container maxWidth={'lg'}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead className={classes.tableTitle}>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell align="right">Submission Id</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows && rows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className={classes.checkbox}>
                              <Checkbox checked={selected[row.id]} onChange={()=>handleChange(row.id)}/>
                            </TableCell>
                            <TableCell scope="row">{row.id}</TableCell>
                            <TableCell align="right">{row.jotFormSubmissionId}</TableCell>
                            <TableCell align="right">
                              <IconButton aria-label="edit" size="small" component={RLink} to={`edit/entry/${row.jotFormSubmissionId}`} className={classes.editBtn}>
                                <Create fontSize="small" />
                              </IconButton>
                              <IconButton onClick={()=>viewData(row.jotFormSubmissionData)}aria-label="view" size="small" className={classes.viewBtn}>
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton onClick={()=>deleteHandler(row.jotFormSubmissionId)} aria-label="view" size="small" className={classes.deleteBtn}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box mt={2}>
                    <Grid container direction="column" alignItems="center">
                      <Grid item>
                        { (selectedIds.length > 0 ) &&
                          <Button onClick={()=>displayCheckout(true)} variant="contained" color="primary">Checkout</Button>
                        }
                        </Grid>
                    </Grid>
                  </Box>
                </Container>
              </div>
            </Container>
          </div>
        <PopupModal data={openPopup} />
        <LoadingBackDrop open={showLoading}/>
      </SystemProvider>
    );
  }
  
  
};


export default inject((stores) => ({
  entryStore: stores.store.entryStore
}))(observer(CartPage));
