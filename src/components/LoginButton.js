import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@material-ui/core/Button';

const LoginButton = (props) => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <Button {...props}
      onClick={() => loginWithRedirect({
        redirect_uri: process.env.REACT_APP_URL+(props.path||'')
      })}
    >
      {props.text || 'Login'}
    </Button>
  );
};

export default LoginButton;