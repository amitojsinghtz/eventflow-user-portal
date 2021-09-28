import React, {useState, useEffect} from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Container, makeStyles, Grid, Link, Button, Box, ButtonGroup, 
  IconButton, Checkbox
} from '@material-ui/core';
import { Link as RLink, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import clsx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useAsyncHook, useCheckStep } from "../utils";
//import { Layout } from "../layouts";
import { SystemProvider } from '../utils/SystemContext';
import { Loading, ViewData } from '../components';
import { isEmpty } from '../utils/Utils';
import Iframe from 'react-iframe'

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
    height:'100vh',
    width:'100%'
  },
  iframe: {
    border:0
  },
  edit:{
    height:'100%',
    paddingBottom:theme.spacing(4)
  },
  loader:{
    height:'100vh',
    width:'100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));


const EditPage = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth0();

  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;
  const [resultReq, setResultReq] = useState(undefined);
  const [resultData, loadingResultData, resultKey] = useAsyncHook(resultReq);
  const [userId, setUserId]  = useState();
  const [submissionId, setSubmissionId] = useState();
  const [viewData, setViewData] = useState();
  const [returnUrl, setReturnUrl] = useState();

  const [edit, setEdit] = useState(false);
  const [formId, setFormId] = useState();
  const [formData, setFormData] = useState();

  const editUrl = process.env.REACT_APP_JOTFORM_EDIT_URL;
  const { getJotFormQuestionsData, getUserProfileData, profileData, jotFormQuestionsData} = props.entryStore;

  let { type } = useParams();

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
    //console.log(location.pathname);
    if(location && location.pathname.indexOf('complete')){
      console.log(location.pathname.indexOf('complete'));
    }
    if(type && type==='profile' && userId){
      getUserProfileData({userId:userId})
      /* setResultReq({ 
        method: 'GET',
        authorized: false,
        url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Submission/GetUserProfileByUserId?userId=${userId}`, 
        type: "application/json",
        key:'profile'
      }); */
    }
  },[type, userId, location]);

  useEffect(()=>{
    if(formId){
      getJotFormQuestionsData({jotformId:formId});
      /* setResultReq({ 
        method: 'GET',
        authorized: false,
        url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Submission/GetJotFormQuestions?jotformId=${formId}`, 
        type: "application/json",
        key:'form'
      }); */
    }
  },[formId]);

  useEffect(()=>{
    if(profileData){
      let returnurl = '', index = 0;
      console.log(toJS(profileData));
      const {jotFormSubmissionId, jotFormSubmissionData} = toJS(profileData);
      const {answers, form_id} = jotFormSubmissionData;
      console.log(answers);
      setSubmissionId(jotFormSubmissionId);
      setViewData(answers);
      setFormId(form_id);
      index = Object.keys(answers).filter(key=>{
                return (answers[key].name==='returnurl')
              });
      returnurl = answers[index[0]].answer;        
      console.log(returnurl);
      if(`${process.env.REACT_APP_URL}edit/profile/complete`!==returnurl){
        console.log('diff');
        setResultReq({ 
          method: 'POST',
          authorized: false,
          url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Submission/UpdateSubmissionAnswer`, 
          type: "application/json",
          body:{
            "jotFormSubmissionId": jotFormSubmissionId,
            "name": "returnurl",
            "pos": parseInt(index[0]),
            "value": `${process.env.REACT_APP_URL}edit/profile/complete`
          },
          key:'updateAnswer'
        });
      }
    }
  },[profileData]);
  useEffect(()=>{
    if(jotFormQuestionsData){
      setFormData(toJS(jotFormQuestionsData));
    }
  },[jotFormQuestionsData]);
  console.log((viewData && !edit))
  return (
    <SystemProvider value={{user:user}}>
        <Container maxWidth={'lg'} className={classes.root}>
          { (viewData && !edit) &&
            <div>
              <ViewData data={viewData} formData={formData}/>
              <Box mt={2} textAlign="center">
                <Button onClick={()=>setEdit(true)} color="primary" variant="contained">Edit Info</Button>
              </Box>
            </div>
          }
          {(submissionId && edit) &&
            <Grid container className={classes.edit}>
              <Box pt={2} pb={2} textAlign="center" width="100%">
                <Button onClick={()=>setEdit(false)} color="primary" variant="contained">Cancel Edit</Button>
              </Box>
              <Iframe url={`${editUrl}${submissionId}?returnurl=${returnUrl}`}
                width="100%"
                height="100%"
                id="myId"
                className={classes.iframe}
                display="initial"
                overflow="auto"
                position="relative"/> 
            </Grid>
          }
        
        </Container>
    </SystemProvider>
  );
  
};

export default inject((stores) => ({
  entryStore: stores.store.entryStore
}))(observer(EditPage));
