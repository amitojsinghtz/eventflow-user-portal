import React, {useState, useEffect, useCallback, useRef} from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Container, makeStyles, FormControlLabel, Checkbox, 
  Grid, Button, Box, Modal, Fade, TextField, Card } from '@material-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import MainCard from '../ui-component/cards/MainCard';
import { CreditCard, LocalAtm } from '@material-ui/icons';
import { Link as RLink, useParams } from 'react-router-dom';
import { useAsyncHook } from "../utils";
import { isEmpty } from '../utils/Utils';
import { Loading} from '../components';
import queryString from 'query-string';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
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
  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    backgroundColor:'#fff',
    border: '2px solid #666',
    padding: '20px'
    // padding: theme.spacing(3),
  },
  input:{
    '& .MuiInputLabel-formControl':{
      color:'#000',
      //fontSize: theme.typography.pxToRem(14),
    }
  }
}));

const CheckoutPage = (props) => {

  let initialData = {
    firstname:'',
    lastname:'',
    email:'',
    line1:'',
    line2:'',
    city:'',
    country:'',
    postalCode:''
  };
  const parsed = queryString.parse(window.location.search);
  const classes = useStyles();
  const rootRef = useRef(null); 
  const {user, selectedIds, entryIds, method} = props;

  const stripe = useStripe();
  const elements = useElements();
  const [rows, setRows] = useState();
  const [total, setTotal] = useState({total:0, currency:''});
  const [clientSecret, setClientSecret] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [cardElement, setCardElement] = useState();
  const [resultReq, setResultReq] = useState(undefined);
  const [resultData, loadingResultData, resultKey] = useAsyncHook(resultReq);
  const [completeData, setCompleteData] = useState();
  const [updatePIData, setUpdatePIData] = useState();
  const [paymentIntent, setPaymentIntent] = useState();
  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;
  const awardid = process.env.REACT_APP_AWARD_CODE;
  const userId = user[namespace+'user_id'];
  const [same, setSame] = useState(true);
  const [contactData, setContactData] = useState();

  const [offlineData, setOfflineData] = useState(initialData);

  const { paymentIntentData, updatePaymentIntentResponse, createOfflinePaymentResponse,
    getPaymentIntentData, updatePaymentIntentData, createOfflinePaymentData, 
    getPricingBySubmissionIdsResponse, getPricingBySubmissionIds
  } = props.paymentStore;
  const { profileData, getUserProfileData } = props.entryStore;

  const updateOfflineData = useCallback(data=>{
    console.log(data);
    if(data){
      let newData = {...initialData};
      data.forEach(o=>{
        if(o.text==='Name'){
          newData.firstname=o.answer.first;
          newData.lastname=o.answer.last;
        }else if(o.text==='Email'){
          newData.email=o.answer;
        }else if(o.text==='Address'){
          newData.line1=o.answer.addr_line1;
          newData.city=o.answer.city;
          newData.country=o.answer.country;
        }
      })
      //console.log(newData);
      setContactData(newData);
      setOfflineData(newData);
    }else
      setOfflineData(initialData);

    setPaymentMethod('offline');
    
    
  });

  
  useEffect(()=>{
    if(method && method==='alipay'){
      console.log(parsed);
      const {payment_intent, payment_intent_client_secret, redirect_status} = parsed;
      console.log(redirect_status);
      setUpdatePIData({paymentIntentId:payment_intent});
      setCompleteData({
        method:'alipay',
        methodName:'Alipay',
        resultData:{
          payment_intent:payment_intent, 
          payment_intent_client_secret: payment_intent_client_secret, 
          redirect_status: redirect_status
        }, 
        entryIds:entryIds
      });
    }
  },[method])

  useEffect(()=>{
    if(selectedIds.length>0){
      getPricingBySubmissionIds({
        userId: user[namespace+'user_id'],
        aliasCode: awardid,
        submissionIds: selectedIds
      });
    }
  },[selectedIds]);


  useEffect(()=>{
    if(updatePIData){
      updatePaymentIntentData(updatePIData);
    }
  },[updatePIData]);

  useEffect(()=>{
    if(completeData){
      console.log('update PI');
      props.onPaymentComplete(completeData);
    }
  },[completeData, updatePaymentIntentResponse ]);

  useEffect(()=>{
    if(paymentIntentData){
      setClientSecret(paymentIntentData.clientSecret);
    }
  },[paymentIntentData]);

  useEffect(()=>{
    if(createOfflinePaymentResponse){
      props.onPaymentComplete({
        method:'offline',
        methodName:'Offline',
        resultData:createOfflinePaymentResponse, 
        entryIds:entryIds
      });
    }
  },[createOfflinePaymentResponse]);

  useEffect(()=>{
    if(profileData && !isEmpty(profileData)){
      console.log(toJS(profileData));
      const {jotFormSubmissionData} = profileData;
      let _data = [];
      for (const [key, item] of Object.entries(jotFormSubmissionData.answers)) {
        _data.push(item);
      }
      console.log(_data);
      updateOfflineData(_data);
    }
  },[profileData]);

  useEffect(()=>{
    if(getPricingBySubmissionIdsResponse){
      setRows(getPricingBySubmissionIdsResponse.items);
      setTotal({total:getPricingBySubmissionIdsResponse.total, currency:getPricingBySubmissionIdsResponse.currency});
    }
  },[getPricingBySubmissionIdsResponse]);
  

  useEffect(()=>{
    if(resultData && !isEmpty(resultData)){
      console.log(resultKey,resultData);
      if(resultKey==='price'){
        setRows(resultData.items);
        setTotal({total:resultData.total, currency:resultData.currency});
      }else if(resultKey==='intent'){
        console.log(resultData);
        setClientSecret(resultData.clientSecret);
      }else if(resultKey==='offline'){
        
        props.onPaymentComplete({
          method:'offline',
          methodName:'Offline',
          resultData:resultData, 
          entryIds:entryIds
        });
        
      }else if(resultKey==='profile'){
        //
        const {jotFormSubmissionData} = resultData;
        let _data = [];
        for (const [key, item] of Object.entries(jotFormSubmissionData.answers)) {
          _data.push(item);
        }
        console.log(_data);
        updateOfflineData(_data);
      }
    }else if(resultKey==='updatePI' && completeData){
      console.log('update PI');
      props.onPaymentComplete(completeData);
    }
  },[resultData])

  useEffect(()=>{
    if(paymentMethod==='credit-card'){
      if(clientSecret && cardElement){
        stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email:props.user.email,
              name: props.user[namespace+'user_id']
            },
          },
        })
        .then(function(result) {
          if (result.error) {
            console.log('[error]', result.error);
          } else {
            console.log('[result]', result);
            setUpdatePIData({paymentIntentId:result.paymentIntent.id});
            setCompleteData({
              method:'credit-card',
              methodName:'Credit Card',
              resultData:resultData, 
              entryIds:entryIds
            });
          }
        });
      }else{
        console.log('clientSecret && cardElement no ready');
      }
    }else if(paymentMethod==='alipay'){
      stripe.confirmAlipayPayment(clientSecret, {
        // Return URL where the customer should be redirected to after payment
        return_url: `${process.env.REACT_APP_URL}payment/alipay`,
        payment_method: {
          type:'alipay',
          billing_details: {
            email:props.user.email,
            name: props.user[namespace+'user_id']
          },
        },
      }).then((result) => {
        if (result.error) {
          
        }else{
         
        }
      });
    }
  }, [clientSecret]);

  const handleChange = (e)=>{
    let newData = {...offlineData};
    if(e.target.name==='same'){
      if(!same){
        console.log(same,contactData);
        setOfflineData(contactData);
      }
      setSame(!same);
    }else{
      newData[e.target.name] = e.target.value;
      setOfflineData(newData);
    }
    
  }
  
  const handleClosePopup = ()=>{
    setPaymentMethod(undefined);
  };

  const getPaymentIntent =(method) =>{
    getPaymentIntentData({
      userId: user[namespace+'user_id'],
      aliasCode: awardid,
      submissionIds: selectedIds, 
      entryIds: entryIds
    });
    
    if(elements && stripe)
      setCardElement(elements.getElement(CardElement));
    setPaymentMethod(method);
  };
  

  const payOffline = (flag) =>{
    if(flag && flag==='submit'){
      createOfflinePaymentData({
        userId: user[namespace+'user_id'],
        aliasCode: awardid,
        submissionIds: selectedIds, 
        entryIds: entryIds,
        ...offlineData
      });
      
      setPaymentMethod(undefined);
    }else{
      getUserProfileData({userId:userId});
    }
  }
  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead className={classes.tableTitle}>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell align="right">Package Name</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((row,i) => (
              <TableRow key={i}>
                <TableCell></TableCell>
                <TableCell align="right">{row.packageName}</TableCell>
                <TableCell align="right">{row.currency} {row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <Typography align='right'>
          Total: {total.currency} {total.total}
        </Typography>
      </Box>
      <Box mt={4} mb={4} p={4}>
        <Container maxWidth="sm">
          <Typography variant="h6" gutterBottom>
            Payment Methods
          </Typography>
          <Grid container alignItems="center" spacing={2} direction="column">
            <Grid item >
              <Button color="primary" variant="contained" onClick={()=>setPaymentMethod('credit-card')}>
                <CreditCard></CreditCard> Pay by Credit Card</Button>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained" onClick={()=>payOffline()}><LocalAtm></LocalAtm> Pay Offline</Button>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained" onClick={()=>getPaymentIntent('alipay')}><CreditCard></CreditCard> Pay by AliPay</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Modal
        open={((paymentMethod!==undefined) && (paymentMethod==='credit-card'))}
        onClose={handleClosePopup}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        container={() => rootRef.current}
      >
        <Fade in={((paymentMethod!==undefined) && (paymentMethod==='credit-card'))}>
          <Box sx={{width: 400 }} className={classes.popup}>
            <Box mt={2} >
              <Typography variant="h5">Credit Card</Typography>
            </Box>
            <Box mt={3}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </Box>
            <Box mt={5}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Button color="primary" fullWidth onClick={()=>getPaymentIntent('credit-card')} variant="contained" type="submit" disabled={!stripe}>
                    Pay
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth onClick={handleClosePopup}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>


      <Modal
        open={((paymentMethod!==undefined) && (paymentMethod==='alipay'))}
        onClose={handleClosePopup}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        container={() => rootRef.current}
      >
        <Fade in={((paymentMethod!==undefined) && (paymentMethod==='alipay'))}>
          <Box sx={{width: 400 }} className={classes.popup} mt={2}>
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item xs={12}>
                <Box mb={2}>
                  <Typography variant="h6">Redirecting to Alipay</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Loading></Loading>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
      

      <Modal
        open={((paymentMethod!==undefined) && (paymentMethod==='offline'))}
        onClose={handleClosePopup}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Fade in={((paymentMethod!==undefined) && (paymentMethod==='offline'))}>
          <Box sx={{width: 400 }} className={classes.popup}>
            <Box mt={2} >
              <Typography variant="h5">Offline Payment</Typography>
            </Box>
            <Box mt={2} className={classes.input}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="First Name" name="firstname" onChange={handleChange} value={offlineData.firstname} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Last Name" name="lastname" onChange={handleChange} value={offlineData.lastname} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" name="email" onChange={handleChange} value={offlineData.email} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address Line 1" name="line1" onChange={handleChange} value={offlineData.line1} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address Line 1" name="line2" onChange={handleChange} value={offlineData.line2} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField  label="City" name="city" onChange={handleChange} value={offlineData.city} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField  label="Country" name="country" onChange={handleChange} value={offlineData.country} InputProps={{readOnly: same}}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField  label="Postal Code" name="postalCode" onChange={handleChange} value={offlineData.postalCode} InputProps={{readOnly: same}}/>
                </Grid>
              </Grid>
            </Box>
            <Box>
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={same}
                  onChange={handleChange}
                  name="same"
                  color="primary"
                />
              }
              label="Same as contact address"
            />
            </Box>
            <Box mt={5}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Button color="primary" fullWidth onClick={()=>payOffline('submit')} variant="contained" type="submit" disabled={!stripe}>
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth onClick={handleClosePopup}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
    
  ); 

};

export default inject((stores) => ({
  entryStore: stores.store.entryStore,
  paymentStore: stores.store.paymentStore
}))(observer(CheckoutPage));