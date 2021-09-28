import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import useIsMounted from '@rodw95/use-mounted-state';

const useAsyncHook = (request)=>{
  const initState = {
    result:[],
    loading:false, 
    key: null
  };
  const [state, setState] = useState(initState);
  const {getAccessTokenSilently} = useAuth0();
  const isMounted = useIsMounted();
    //console.log(request);
    useEffect(() => {
      async function fetchData(req) {
        try {
          const token = await getAccessTokenSilently();
          //const token = process.env.REACT_APP_FORMSTACK_ACCESSTOKEN;
          console.log(req);
          setState({...initState,loading:true, key:req.key});
          let response, headers;

          if(req.authorized){
            headers = { 'Authorization': `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                        'Content-Type': req.type };
          }else{
            headers = { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
                        ,'Content-Type': req.type };
          }
          if(req.method==='POST' || req.method==='post'){
            response = await axios.post(req.url, 
              req.body, {
                headers: headers
              }
            );
          }else if(req.method==='GET' || req.method==='get'){
            response = await axios.get(req.url, {
              headers: headers
            });
          }
          //console.log(response.data,isMounted());  
          if(!isMounted())
            return;
          //console.log(response);

          if(response.status === 200){
            setState({result:response.data,loading:false, key:req.key});
            return [response.data, false, req.key];
          }
          
        } catch (error) {
          console.log(error);
          setState({result:{error:error},loading:false, key:null});
          return [{eroor:error}, false, req.key];
        }
      }
      if (request) {
        fetchData(request);
      }
    }, [request]);
  return [state.result, state.loading, state.key];
}


export default useAsyncHook;