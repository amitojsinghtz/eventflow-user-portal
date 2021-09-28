import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import { Typography, Container, makeStyles, Grid, Link, Button, Box } from '@material-ui/core';
import { Link as RLink, useParams } from 'react-router-dom';
import queryString, { parse } from 'query-string';
import clsx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { isEmpty, setFormParams } from "../utils/Utils";
//import { Layout } from "../layouts";
import { SystemProvider } from '../utils/SystemContext';
import { Loading, Steps } from '../components';
//import useScript from 'react-script-hook';
import postscribe from 'postscribe';



const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
  },
  form: {
    width: '100%'
  }
}));

const FormPage = (props) => {
  
  const parsed = queryString.parse(window.location.search);
  const classes = useStyles();
  const { isAuthenticated, user, isLoading } = useAuth0();
  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;

  const awardid = parsed.aliasCode || process.env.REACT_APP_AWARD_CODE;
  let { formId } = useParams();
  let returnurl = '';

  const [currStepData, setCurrStepData] = useState();

  const [currStepId, setcurrStepId] = useState();
  const [formData, setFormData] = useState({ userid: '',email: '',aliascode: '',form: '',params: '', formName:'', returnurl:process.env.REACT_APP_URL});
  const [isReady, setReady] = useState(false);

  const { fetchStepData, stepData } = props.stepStore;

  useEffect(()=>{
    if(awardid && user){
      fetchStepData({ aliasCode: awardid, userId: user[namespace + 'user_id'] });
      setFormData({ ...formData, userid: user[namespace + 'user_id'], aliascode: awardid, email: user.email})
    }
  },[awardid, user]);

  useEffect(() => {
    console.log(formId, isReady, formData);
    if (formId && isReady) {
      postscribe('#form', `<script type="text/javascript" src="https://form.jotform.com/jsform/${formId}${formData.params}"></script>`);
    }
  }, [formId, isReady, formData]);

  useEffect(()=>{
    const currStepData = toJS(stepData);
    //console.log(currStep, workflow, stepsData);
    if(currStepData && !isEmpty(currStepData)){
      let urlParams = '', forceStep;
      const { workflow, currStep } = currStepData;
      console.log(currStepData);
      setCurrStepData(currStepData);
      //console.log('here');
      if(parsed.force)
        forceStep = workflow.find((o)=>{return o.stepId=== parsed.force});
      //console.log(stepCheckResult, workflow, currStep);
      if(parsed.force && !isEmpty(forceStep)){

        urlParams = setFormParams(forceStep.forms[0].params, formData, '?', true);
        console.log(urlParams);
        //console.log(forceStep, forceStep.forms[0].params, formData);
        setFormData({ ...formData,formName: forceStep.forms[0].name, params: urlParams});
        setReady(true);
      }else{
        if(currStep.action==='form-render'){
          urlParams = setFormParams(currStep.forms[0].params, formData, '?', true);
          setFormData({ ...formData,formName: currStep.forms[0].name, params: urlParams});
          setReady(true);
        }else if(currStep.action!=='form-render'){
          //urlParams = setFormParams(parsed, formData, true);
          returnurl = `${process.env.REACT_APP_URL}/cart`
          urlParams = `?returnurl=${encodeURIComponent(returnurl)}&${queryString.stringify(parsed)}`;
          setReady(true);
          setFormData({ ...formData,formName: parsed.formName || 'Form', params: urlParams});
          console.log('not ',formData, `${urlParams}`);
        }
      }
      //setFormData({ ...formData, form: currStep.forms[0] });
      
      
      setcurrStepId(currStep.stepId);
    }
  },[stepData]);

  useEffect(() => {
    const fn = async () => {
      if (!isLoading) {
        if (user) {
          console.log(user);
          //setUserId(user[namespace+'user_id']);
        }
        //console.log("handleRedirectCallback: " + loading);
        //await handleRedirectCallback();
      } else {

      }
    };
    fn();
  }, [isAuthenticated, isLoading]);

  if(currStepData && !isEmpty(currStepData)){
    return (
      <SystemProvider value={{ user: user, workflow: currStepData.workflow, stepData: currStepData.currStep }}>
          <div >
            <Container maxWidth={'lg'}>
              <div className={classes.root}>
                <Container maxWidth={'md'}>
                  <Grid>
                    {currStepData.workflow &&
                      <Steps currStepId={currStepId} workflow={currStepData.workflow} />
                    }
                  </Grid>
                </Container>
                <Container maxWidth={'lg'}>
                  <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant='h4' gutterBottom>{formData.formName}</Typography>
                    <div id="form" className={classes.form}></div>
                  </Grid>
                </Container>
              </div>
            </Container>
          </div>
      </SystemProvider>
    );
  }else{
    return(
      <Container maxWidth={'lg'}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Loading/>
        </Grid>)
      </Container>
    )
  }               

};

export default inject((stores) => ({
  stepStore: stores.store.stepStore
}))(observer(FormPage));
