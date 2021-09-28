import React, { useState, useEffect, useRef } from 'react'
import { inject, observer } from 'mobx-react'

import {Link, useParams} from 'react-router-dom';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Container, makeStyles, FormControlLabel, Checkbox, 
  Grid, Button, Box, Modal, Fade, TextField, Card } from '@material-ui/core';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { CreditCard, LocalAtm } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles/'
import { useAuth0 } from '@auth0/auth0-react'
import { entrantFactory } from '../../utils';
import Loader from '../../ui-component/Loader'
import { history, toast } from '../../utils'
import {  IconShoppingCart } from '@tabler/icons'
import { ToastContainer } from 'react-toastify'
import queryString from 'query-string';
import { Loading, PopupModal, LoadingBackDrop} from '../../components';
import {PaymentErrorCodes, paymentErrorCodes } from '../../store/paymentErrorCodes';

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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const CheckoutPage = (props) =>{
  return(
    <Elements stripe={stripePromise}>
      <Checkout/>
    </Elements>
  )
  
}

const Checkout = inject((stores) => ({
  flowStore: stores.store.flowStore,
  paymentStore: stores.store.paymentStore,
  entrantStore: stores.store.entrantStore
}))(observer((props)=>{
    const stripe = useStripe();
    const theme = useTheme()
    const [showLoader, setShowLoader] = useState(true)
    const { isLoading } = useAuth0()
    const [paymentMethod, setPaymentMethod] = useState();
    const elements = useElements();
    const classes = useStyles();
    const rootRef = useRef(null); 
    const { method } = useParams();
    const parsed = queryString.parse(window.location.search);

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
    const [same, setSame] = useState(true);
    const [cardElement, setCardElement] = useState();
    const [profileData, setProfileData] = useState();
    const [completeData, setCompleteData] = useState();
    const [payingNow, setPayingNow] = useState(false);
    const [offlineProfileData, setOfflineProfileData] = useState(initialData);
    const [openPopup, setOpenPopup] = useState({open:false,title:'',content:''});

    const { userAwardAlias, userId, userAwardId } = props.flowStore

    const {
      paymentIntentData, 
      updatePaymentIntentResponse, 
      createOfflinePaymentResponse,
      getPaymentIntentData, 
      updatePaymentIntentData, 
      createOfflinePaymentData, 
      getPricingBySubmissionIdsResponse, 
      getPricingBySubmissionIds, 
      setCheckoutData,
      checkoutData
    } = props.paymentStore

    const { getEntrantForm, entrantForm } = props.entrantStore

    const handleClosePopup = ()=>{
      setPaymentMethod(undefined);
    };

    const handleChange = (e)=>{
      let newData = {...offlineProfileData};
      if(e.target.name==='same'){
        if(!same)
          setOfflineProfileData(profileData);
        setSame(!same);
      }else{
        newData[e.target.name] = e.target.value;
        //console.log(newData)
        setOfflineProfileData(newData);
      }
      
    }

    const getPaymentIntent =(method) =>{
      if(checkoutData?.selectedIds.length>0){
        getPaymentIntentData({
          userId: userId,
          aliasCode: userAwardAlias,
          submissionIds: checkoutData?.selectedIds,
          email:profileData.email,
          company:profileData.company,
          country:profileData.country

        });
        
        if(elements && stripe){
          setPayingNow(false);
          setCardElement(elements.getElement(CardElement));
        }
        if(method==='alipay')
          setPayingNow(true);
        setPaymentMethod(method);
      }
      
    };

    const payOffline = (flag) =>{
      if(!flag){
        if(offlineProfileData?.firstname===''){
          setOfflineProfileData(profileData);
        }
        setPaymentMethod('offline');
      }else if(flag==='submit' && checkoutData?.selectedIds.length>0){
        setPayingNow(true);
        createOfflinePaymentData({
          userId: userId,
          aliasCode: userAwardAlias,
          submissionIds: checkoutData.selectedIds, 
          ...offlineProfileData
        });
      }
    }

    useEffect(()=>{
      console.log(paymentIntentData);
      if(paymentIntentData?.clientSecret){
        const {clientSecret}  = paymentIntentData
        if(paymentMethod==='credit-card'){
          if(clientSecret && cardElement){
            try{
              setPayingNow(true);
              stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                  card: cardElement,
                  billing_details: {
                    email:profileData.email,
                    name: profileData.name
                  },
                },
              })
              .then(function(result) {
                if (result.error) {
                  console.log('[error]', result.error);
                  setPaymentMethod(undefined)
                  let errStr = (result.error.code  && PaymentErrorCodes[result.error.code])?
                                `${PaymentErrorCodes[result.error.code]}<br/>`
                                :'';
                  errStr += result.error?.message||'';
                  errStr += '\nPlease try a different payment method or credit card. If you still not able to complete the payment, please contact your credit card issuer or payment service provider. Thank you.'
                  
                  setOpenPopup({
                    open:true,
                    title:"Failed Payment", 
                    content:errStr,
                    severity:'error'
                  });
                } else {
                  console.log('[result]', result);
                  setPaymentMethod(undefined)
                  updatePaymentIntentData({paymentIntentId:result.paymentIntent.id});
                  setCompleteData({
                    method:'credit-card',
                    methodName:'Credit Card',
                    resultData:{
                      payment_intent:result.paymentIntent
                    }
                  });
                }
              });
            }catch(error){
              console.log(error);
            }
            
          }else{
            console.log('clientSecret && cardElement no ready');
          }
        }else if(paymentMethod==='alipay'){
          stripe.confirmAlipayPayment(clientSecret, {
            // Return URL where the customer should be redirected to after payment
            return_url: `${process.env.REACT_APP_URL}checkout/alipay`,
            payment_method: {
              type:'alipay',
              billing_details: {
                email:profileData.email,
                name: profileData.name
              },
            },
          }).then((result) => {
            if (result.error) {
              
            }else{
              
            }
          });
        }
      }
    },[paymentIntentData]);

    useEffect(()=>{
      if(checkoutData?.selectedIds?.length>0){
        getPricingBySubmissionIds({
          userId: userId,
          aliasCode: userAwardAlias,
          submissionIds:checkoutData.selectedIds
        });
      }
    },[checkoutData, userAwardAlias, userId]);

    useEffect(() => {
      if (userId && userAwardId) getEntrantForm({ userId, awardId: userAwardId })
    }, [userId, userAwardId])

    useEffect(()=>{
      
      if(entrantForm?.formData){
        setProfileData(entrantFactory.mapDetailFields(JSON.parse(entrantForm.formData)));
      }
    },[entrantForm]);
    //console.log(method);
    useEffect(()=>{
      console.log(method);
      if(method && method==='alipay'){
        const {payment_intent, payment_intent_client_secret, redirect_status} = parsed;
        updatePaymentIntentData({paymentIntentId:payment_intent});
        setCompleteData({
          method:'alipay',
          methodName:'Alipay',
          resultData:{
            payment_intent:payment_intent, 
            payment_intent_client_secret: payment_intent_client_secret, 
            redirect_status: redirect_status
          }
        });
        
      }else if(createOfflinePaymentResponse){

        setCompleteData({
          method:'offline',
          methodName:'Offline',
          resultData:{
            payment_intent:createOfflinePaymentResponse
          }
        });
        setOpenPopup({
          open:true,
          title:"Offine Payment is submitted", 
          content:`Thank you for the submission. Please complete the payment according to your invoice details`,
          severity:'success'
        });
        setPaymentMethod(undefined)
        setCheckoutData(null);
      }
    },[method, createOfflinePaymentResponse])

    useEffect(()=>{
      console.log(completeData);
      if(completeData){
        if(completeData?.resultData?.redirect_status==='failed'){
          setOpenPopup({
            open:true,
            title:"Payment Failed", 
            content:`Please try a different payment method or credit card. If you still not able to complete the payment, please contact your credit card issuer or payment service provider. Thank you.`, 
            severity:'error'
          });
        }else{
          setOpenPopup({
            open:true,
            title:"Payment Completed", 
            content:`Thank you for the ${completeData.methodName} Payment`, 
            severity:'success'
          });
        }
        
        setPaymentMethod(undefined)
        setCheckoutData(null);
      }
    },[updatePaymentIntentResponse])
    

    const creditCardModal = () =>{
      return (
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
                    <Button color="primary" disabled={payingNow} fullWidth onClick={()=>getPaymentIntent('credit-card')} variant="contained" type="submit" >
                      Pay
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth onClick={handleClosePopup}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )
    }

    const alipayModal = () =>{
      return (
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
                  <Loader></Loader>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>
      )
    }

    const offlineModal = () =>{
      return (
        <Modal
          open={((paymentMethod!==undefined) && (paymentMethod==='offline'))}
          onClose={handleClosePopup}
        >
          <Fade in={((paymentMethod!==undefined) && (paymentMethod==='offline'))}>
            <Box sx={{width: 400 }} className={classes.popup}>
              <Box mt={2} >
                <Typography variant="h5">Offline Payment</Typography>
              </Box>
              <Box mt={2} className={classes.input}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="First Name" name="firstname" onChange={handleChange} value={offlineProfileData?.firstname || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Last Name" name="lastname" onChange={handleChange} value={offlineProfileData?.lastname || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email" name="email" onChange={handleChange} value={offlineProfileData?.email || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address Line 1" name="line1" onChange={handleChange} value={offlineProfileData?.line1 || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address Line 1" name="line2" onChange={handleChange} value={offlineProfileData?.line2 || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField  label="City" name="city" onChange={handleChange} value={offlineProfileData?.city || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField  label="Country" name="country" onChange={handleChange} value={offlineProfileData?.country || ''} InputProps={{readOnly: same}}/>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField  label="Postal Code" name="postalCode" onChange={handleChange} value={offlineProfileData?.postalCode || ''} InputProps={{readOnly: same}}/>
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
                    <Button color="primary" disabled={payingNow} fullWidth onClick={()=>payOffline('submit')} variant="contained" type="submit" >
                      Pay
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth onClick={handleClosePopup}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )
    }

    if(getPricingBySubmissionIdsResponse?.items && checkoutData?.selectedIds.length>0 && profileData){
      return(
        <>
          <Container maxWidth={'lg'}>
            <Box mb={2}>
              <Grid container >
                <Grid item>
                  <Link to="/submission/list">
                    <Button variant="outlined" size="small">Back to records</Button>
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Paper elevation={3}>
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
                      {getPricingBySubmissionIdsResponse?.items.map((row,i) => (
                        <TableRow key={i}>
                          <TableCell>{row.categoryName}</TableCell>
                          <TableCell align="right">{row.packageName}</TableCell>
                          <TableCell align="right">{row.currency} {row.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box p={2}>
                  <Typography align='right'>
                    Total: {getPricingBySubmissionIdsResponse?.currency} {getPricingBySubmissionIdsResponse?.total}
                  </Typography>
                </Box>
                <Box mt={4} mb={4} p={4}>
                  <Container maxWidth="sm">
                    
                    <Box mb={2}>
                      <Typography variant="h5" gutterBottom>
                        Payment Methods
                      </Typography>
                    </Box>
                    <Grid container alignItems="center" spacing={2} >
                      <Grid item >
                        <Button color="primary" variant="contained" onClick={()=>getPaymentIntent('credit-card')} disabled={!!paymentMethod}>
                          <CreditCard></CreditCard> Pay by Credit Card</Button>
                      </Grid>
                      <Grid item>
                        <Button disabled={!!paymentMethod} color="primary" variant="contained" onClick={()=>payOffline()}><LocalAtm></LocalAtm> Pay Offline</Button>
                      </Grid>
                      <Grid item>
                        <Button disabled={!!paymentMethod} color="primary" variant="contained" onClick={()=>getPaymentIntent('alipay')}><CreditCard></CreditCard> Pay by AliPay</Button>
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
                {creditCardModal()}
                {alipayModal()}
                {offlineModal()}
              </div>
            </Paper>
          </Container>
          <PopupModal data={openPopup} />
        </>
      )
    }else{
      return (
        <>
          <Container maxWidth={'lg'}>
            <Box p={5}>
              <Grid container spacing={2} flexDirection="column" alignItems="center" justifyContent="center">
                <Grid item>
                  <Typography align="center" variant="h4">
                    Empty Cart <IconShoppingCart/>
                  </Typography>
                </Grid>
                <Grid item>
                  <Link to="/submission/list">
                    <Button variant="outlined">Back to records</Button>
                  </Link>
                </Grid>
                
              </Grid>
            </Box>
          </Container>
          <PopupModal data={openPopup} />
        </>
      )
    }
    

  }
  

));

export default CheckoutPage;