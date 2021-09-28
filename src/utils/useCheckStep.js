import React, { useState, useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useAsyncHook } from "./";

const useCheckStep = (data)=> {
  const initState = {
    step:null,
    workflow:null,
    stepData:null,
    loading:false
  }
  const [state, setState] = useState(initState);
  const {getAccessTokenSilently} = useAuth0();

  useEffect(()=>{
    async function fetchData(userId, code) {
      try {
        const token = await getAccessTokenSilently();
        //console.log('hihi');
        setState({...initState,loading:true});
        let headers, currStepData, stepRep, workRep, stepData, workData;

        if(false){
          headers = { 'Authorization': `Bearer ${token}`,
                      "Access-Control-Allow-Origin": "*",
                      'Content-Type': "application/json" };
        }else{
          headers = { 'Content-Type': "application/json" };
        }
        stepRep = await axios.get(process.env.REACT_APP_EVENTFLOW_API_URL+`api/Award/GetAwardStepNumberByAliasCode?aliasCode=${code}&userId=${userId}`, {
          headers: headers
        });
        workRep = await axios.get(process.env.REACT_APP_EVENTFLOW_API_URL+`api/Award/GetAwardByAliasCode?aliasCode=${code}`,  {
          headers: headers
        });

        axios.all([stepRep, workRep]).then(
          axios.spread((...res) => {
            stepData = res[0].data;
            workData = res[1].data;
            console.log(workData); console.log(stepData);
            if(workData.jotFormConfig  && workData.jotFormConfig.Workflow){
              //console.log('here0', stepRep.data, workRep.data.jotFormConfig.rootElement);
              currStepData = workData.jotFormConfig.Workflow.find((o)=>{
                return (o.stepId === stepData.stepId)
              })
              setState({stepData:currStepData, workflow:workData.jotFormConfig.Workflow, step:stepData, loading:false})
              return [currStepData, workData.jotFormConfig.Workflow, stepData, false];
            }
            // use/access the results 
          })
        ).catch(errors => {
          // react on errors.
          //console.log('hrer1');
          setState({...initState,loading:false});
          return [state.step,state.workflow,state.stepData,false];
        })

        
        
      } catch (error) {
        //console.log('hrer2');
        setState({...initState,loading:false});
        return [state.step,state.workflow,state.stepData,false];
      }
    }
    //console.log(data);
    if(data && data.userId && data.code){
      fetchData(data.userId, data.code);
    }
  },[data]);

  /* function GetCheckStatus(userId, code){
    const [stepData, stepLoading] = useAsyncHook({
      method: 'GET',
      authorized: false,
      url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Award/GetAwardStepNumberByAliasCode?aliasCode=${code}&auth0Id${userId}`, 
      type: "application/json"
    });

    const [workflowData, workflowLoading] = useAsyncHook({
      method: 'GET',
      authorized: false,
      url: process.env.REACT_APP_EVENTFLOW_API_URL+`api/Award/GetAwardByAliasCode?aliasCode=${code}`, 
      type: "application/json"
    });
    
    useEffect(()=>{
      let workflow;
      if(stepData && workflowData){
        if(workflowData.jotFormConfig && workflowData.jotFormConfig.rootElement && workflowData.jotFormConfig.rootElement.Workflow){
          workflow = workflowData.jotFormConfig.rootElement.Workflow.find((o)=>{
            return o.stepId === stepData.stepId
          })
          setState({stepData:workflow, workflow:workflowData, step:stepData, loading:false})
        }
      }
      
    },[stepData, workflowData]);

  } */
  
  //console.log('hrer3', state);
  return [state.step, state.workflow, state.stepData, state.loading];
  
}

export default useCheckStep;