import React, { useState, useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import { Typography, Container, makeStyles, Grid, Link, Button, Box } from '@material-ui/core';
import { Link as RLink, useParams, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import clsx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useAsyncHook, useCheckStep } from "../utils";
//import { Layout } from "../layouts";
import { SystemProvider } from '../utils/SystemContext';
import { Loading, LoadingBackDrop } from '../components';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
    minHeight: '500px'
  },
  form: {
    width: '100%'
  }
}));

const CompletePage = (props) => {
  const parsed = queryString.parse(window.location.search);
  const classes = useStyles();
  const { isAuthenticated, user, isLoading } = useAuth0();

  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;
  const [userId, setUserId] = useState();

  const [updatingForm, setUpdatingForm] = useState(false);
  const [nextFormId, setNextFormId] = useState();
  const [nextStepId, setNextStepId] = useState();
  const [redirectUrl, setRedirectUrl] = useState();

  const [errorMessage, setErrorMessage] = useState(); 

  const awardid = parsed.aliasCode || process.env.REACT_APP_AWARD_CODE;
  const submissionid = parsed.jotFormSubmissionId || null;

  const { updateSubmissionData, updateSubmissionResponseData } = props.entryStore;
  const { fetchStepData, stepData } = props.stepStore;
  useEffect(() => {
    const fn = async () => {
      if (!isLoading) {
        if (user)
          setUserId(user[namespace + 'user_id']);
      }
    };
    fn();
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (nextFormId)
      setRedirectUrl(`form/${nextFormId}?aliasCode=${awardid}`);
  }, [nextFormId]);

  useEffect(() => {
    if (nextStepId)
      setRedirectUrl(`select/${nextStepId}?aliasCode=${awardid}`);
  }, [nextStepId]);

  useEffect(() => {
    console.log(window.location.search);
    if (awardid && submissionid && userId) {
      console.log('update form');
      setUpdatingForm(true);
      updateSubmissionData(parsed);

      
    } else if (userId && ((awardid && !submissionid) || (!awardid && !submissionid))) {
      console.log('checking');
      fetchStepData({ aliasCode: awardid, userId: userId });
    }
  }, [submissionid, userId]);


  useEffect(()=>{
    if(updateSubmissionResponseData){
      if(updateSubmissionResponseData.status==='Success'){
        fetchStepData({ aliasCode: awardid, userId: userId });
      }else if(updateSubmissionResponseData.error){
        setErrorMessage({title:'Submission Error',message:'Submission ID not found'});
      }
      setUpdatingForm(false);
    }
  },[updateSubmissionResponseData])


  useEffect(() => {
    //console.log(stepLoading);
    if (stepData && !updatingForm) {
      const {currStep} = toJS(stepData);
      console.log('stepcheck', toJS(stepData));
      if (currStep && currStep.action === 'form-render') {
        setNextFormId(currStep.forms[0].id);
      } else if (currStep && currStep.action === 'dropdown-render') {
        setNextStepId(currStep.stepId);
      }
    }
  }, [stepData]);
  
  console.log(redirectUrl);
  if (redirectUrl) {
    return (
      <Redirect to={redirectUrl} />
    )
  }else if(errorMessage){
    return (
      <SystemProvider value={{ user: user }}>
          <div >
            <Container maxWidth={'lg'}>
              <div className={classes.root}>
                <Container maxWidth={'lg'}>
                  <Grid className={classes.root}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Typography variant="h4" gutterBottom>{errorMessage.title}</Typography>
                    <Typography variant="h5">{errorMessage.message}</Typography>
                  </Grid>
                </Container>
              </div>
            </Container>
          </div>
      </SystemProvider>
    );
  }else 
    return <LoadingBackDrop open={true}/>


};

export default inject((stores) => ({
  entryStore: stores.store.entryStore,
  stepStore: stores.store.stepStore
}))(observer(CompletePage));
