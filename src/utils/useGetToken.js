import React, { useState} from 'react';
import { useAsyncHook, useLocalStorage } from "./";

const useGetToken = (code)=> {
  const [token, setToken] = useLocalStorage(`${process.env.REACT_APP_FORMSTACK_KEY}token`);
  
}

export default useGetToken;