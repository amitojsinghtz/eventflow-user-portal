import React, { useState, useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';
import {
  Container, makeStyles, Grid, Select, InputLabel, MenuItem, FormControl
} from '@material-ui/core';
import { Link as RLink, useParams, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import clsx from 'clsx';
import { isEmpty, setFormParams, checkParamsValue } from "../utils/Utils";
import { useAuth0 } from '@auth0/auth0-react';
import { useAsyncHook, useCheckStep } from "../utils";
//import { Layout } from "../layouts";
import { SystemProvider } from '../utils/SystemContext';
import { Loading, Steps } from '../components';
import SubCard from '../ui-component/cards/SubCard';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
    '& .MuiInput-input': {
      //fontSize: theme.typography.pxToRem(13),
    }
  },
  form: {
    width: '100%',
    // padding: theme.spacing(0, 4)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  label: {
    color: '#000'
  }
}));

const SelectPage = (props) => {

  const parsed = queryString.parse(window.location.search);
  const classes = useStyles();
  const { isAuthenticated, user, isLoading } = useAuth0();

  const { fetchStepData, stepData } = props.stepStore;

  let { stepId } = useParams();
  const awardid = parsed.aliasCode || process.env.REACT_APP_AWARD_CODE;
  const [currStepData, setCurrStepData] = useState();

  //const [loading, error] = useScript({ src: formUrl});
  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;
  const [resultReq, setResultReq] = useState(undefined);
  const [resultData, loadingResultData, resultKey] = useAsyncHook(resultReq);

  //const [csData, setCheckStepData] = useState();
  //const [stepCheckResult, workflow, currStep, stepLoading] = useCheckStep(csData);

  const [nextStepId, setNextStepId] = useState();
  const [currStepId, setCurrStepId] = useState();
  const [step, setStep] = useState();
  const [dropdownIndex, setDropdownIndex] = useState(1);
  const [dropdownData, setDropdownData] = useState({});
  const [selections, setSelections] = useState({});
  const [initSelections, setInitSelections] = useState({});
  const [formUrl, setFormUrl] = useState();
  const [formData, setFormData] = useState({
    userid: '',
    aliascode: '',
    namecode: '',
    returnurl: process.env.REACT_APP_URL
  })
  const [userId, setUserId] = useState();

/*   useEffect(() => {
    
    if (awardid && userId) {
      console.log(awardid, userId);
      setCheckStepData({ code: awardid, userId: userId });
      setFormData({ ...formData, userid: userId, aliascode:awardid});
    }
  }, [awardid, userId]); */

  useEffect(()=>{
    //console.log(toJS(stepData));
    const currStepData = toJS(stepData);
    //console.log(currStep, workflow, stepsData);
    if(currStepData && !isEmpty(currStepData)){
      //{currStep:currStepData, workflow: workData.jotFormConfig.Workflow, stepsData: stepData}
      const { workflow, currStep } = currStepData;

      setCurrStepData(currStepData);
      setCurrStepId(currStep.stepId);
      
      if (workflow && currStep.stepId) {
        workflow.forEach((w, i) => {
          if (w.stepId === stepId) {
            setStep(workflow[i]);
            if ((workflow.length) > (i + 1)) {
              setNextStepId(workflow[i + 1].stepId);
              setCurrStepId(i + i);
            }
          }
        })
      }
    }
  },[stepData]);

  useEffect(()=>{
    if(awardid && userId){
      fetchStepData({aliasCode:awardid, userId:userId});
      setFormData({ ...formData, userid: userId, aliascode:awardid});
    }
      
  },[awardid, userId]);

  useEffect(() => {
    //console.log(resultData, resultKey, dropdownData,(resultKey in dropdownData) );
    let _dropdownData = { ...dropdownData };
    if (resultKey && (resultKey in dropdownData)) {
      //console.log('resultData resultKey', resultKey);
      _dropdownData[resultKey] = resultData;
      setDropdownData(_dropdownData);
    }/* else if(resultData.jotFormConfig && resultData.jotFormConfig.rootElement && resultData.jotFormConfig.rootElement.Workflow){
            setWorkFlow(resultData.jotFormConfig.rootElement.Workflow);
            setFlowData(resultData);
        } */
  }, [resultData]);

  useEffect(() => {
    let _dropdownData = { ...dropdownData };
    let _selections = { ...selections };
    if (step) {
      step.dropdown.forEach((item, i) => {
        if (item.value.length > 0) {
          item.value.forEach((o) => {
            if (selections[o] !== initSelections[o]) {
              console.log(o, 'is updated =>', item.id);
              delete _dropdownData[item.id];
            }
          })
        }
      })
      setDropdownData(_dropdownData);
    }
  }, [selections])

/*   useEffect(() => {
    // check first step
    console.log(workflow);
    if (workflow && currStep.stepId) {
      workflow.forEach((w, i) => {
        if (w.stepId === stepId) {
          setStep(workflow[i]);
          if ((workflow.length) > (i + 1)) {
            setNextStepId(workflow[i + 1].stepId);
            setCurrStepId(i + i);
          }
        }
      })
    }
  }, [workflow]); */

  useEffect(() => {
    const fn = async () => {
      if (!isLoading) {
        if (user){
          setUserId(user[namespace + 'user_id']);
        }
      }
    };
    fn();
  }, [isAuthenticated, isLoading]);


/*   useEffect(() => {
    //console.log(stepLoading, user, step, workflow, currStep);
    if (!stepLoading && user && stepCheckResult && workflow && currStep) {
      console.log(stepCheckResult, workflow, currStep);
      setCurrStepId(currStep.stepId);
    }
  }, [stepLoading, user, stepCheckResult, workflow, currStep]); */

  const handleSelection = (key, e) => {
    const { workflow } = currStepData;
    let _selections = { ...selections };

    console.log('handleSelection', key, e.target, step)
    console.log('workflow:',workflow, currStepId);
    console.log('dropdownData:',dropdownData, step.dropdown[step.dropdown.length - 1]);

    if (key === step.dropdown[step.dropdown.length - 1].id) {
      let params = '', newData, _formData = {...formData};
      let selected = dropdownData[key].find(o => {
        return (o.id === e.target.value);
      })
      console.log(selected);
      if(selected.params){
        newData = checkParamsValue(selected.params.params, selected, _formData);
        //console.log(newData);
        params = setFormParams(selected.params.params, newData, '&', false);
      }
      console.log(params);
      setFormUrl(encodeURI(`/form/${selected.jotFormId}?formName=${selected.name}${params}`));
    }
    if (step) {
      step.dropdown.forEach((item, i) => {
        if (item.value.length > 0) {
          item.value.forEach((o) => {
            if (key === o) {
              _selections[item.id] = '';
            }
          })
        }
      })
    }
    setInitSelections(selections);
    _selections[key] = e.target.value;
    console.log(_selections);
    setSelections(_selections);

  }
  const getDropDownData = (method, id, url) => {
    let req = {
      method: method,
      authorized: false,
      url: process.env.REACT_APP_EVENTFLOW_API_URL + `${url}`,
      type: "application/json",
      key: id
    };
    //console.log(req);
    setResultReq(req);
  }
  const renderSelect = (data, index) => {
    //console.log(data.id, dropdownData, !(data.id in dropdownData), loadingResultData);
    let _dropdownData, inSelection = false, neededSelection = false, isReady = false,
      reqUrl = '';
    if (data.value.length > 0) {
      neededSelection = true;
      data.value.forEach((o) => {
        if (!(o in selections)) {
          //console.log(data.id+' no ready', selections);
          inSelection = false;
        } else if (selections[o] !== '' && selections[o] !== null) {
          inSelection = true;
          //console.log(data.id, 'in selections', (o in selections), selections);
        } else
          inSelection = false;
      })
    }
    // no need related variables
    if (data && !loadingResultData) {
      //console.log(data.id, 'neededSelection:',neededSelection,'inSelection:',inSelection,dropdownData);
      if (!neededSelection) {
        // newly added
        if (!(data.id in dropdownData)) {
          //console.log('init',data.id);
          _dropdownData = { ...dropdownData, [data.id]: null };
          setDropdownData(_dropdownData);
          reqUrl = data.url;
          getDropDownData(data.method.toLowerCase(), data.id, reqUrl);
        }
        // need varaibles
      } else if (inSelection && neededSelection) {
        if (!(data.id in dropdownData)) {
          //console.log('init2',data.id);
          _dropdownData = { ...dropdownData, [data.id]: null };
          setDropdownData(_dropdownData);
          reqUrl = data.url;
          data.value.forEach(o => {
            reqUrl = reqUrl.replace(`{${o}}`, selections[o]);
          })
          getDropDownData(data.method.toLowerCase(), data.id, reqUrl);
        }

        //console.log(dropdownData, reqUrl);
      }
    }


    if (neededSelection && !inSelection) {
      //console.log(data.id,' returning');
      return;
    } else if ((inSelection && neededSelection) || (!neededSelection)) {
      //console.log(dropdownData, data.id, selections);
      return (
        <FormControl key={data.name} className={classes.formControl}>
          <InputLabel className={classes.label}>{data.name}</InputLabel>
          <Select
            name={data.name}
            autoWidth={true}
            value={selections[data.id] || ''}
            onChange={(e) => { handleSelection(data.id, e) }}
          >
            {dropdownData[data.id] && dropdownData[data.id].map((o, k) => {
              if (o.jotFormId)
                return <MenuItem key={`menu-${data.name}-${k}`} value={o.id}>{o.name}</MenuItem>
              else
                return <MenuItem key={`menu-${data.name}-${k}`} value={o.value}>{o.displayName}</MenuItem>
            })}
          </Select>
        </FormControl>
      )
    }


  }

  if(formUrl){
    return (
      <Redirect to={formUrl}/>
    )
  }else if(currStepData){
    return (
      <SystemProvider value={{ user: user, workflow: currStepData.workflow, stepData: currStepData.currStep }}>
          <div >
            <Container maxWidth={'lg'}>
              <div className={classes.root}>
                <Container maxWidth={'md'}>
                  <Grid>
                    {currStepData && currStepData.workflow &&
                      <Steps currStepId={currStepId} workflow={currStepData.workflow} />
                    }
                  </Grid>
                </Container>
                <SubCard>
                  <Grid container direction="column" justify="center" alignItems="center">
                    {step && (step.action === 'dropdown-render') &&
                      step.dropdown.map((item, i) => (
                        renderSelect(item, i)
                      ))
                    }
                  </Grid>
                </SubCard>
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
}))(observer(SelectPage));
