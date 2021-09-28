import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { inject, observer } from 'mobx-react'
import {IconButton, Button, Tooltip} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons/';

const LogoutButton = (props) => {
  const { logout } = useAuth0();

  const { resetUserState } = props.flowStore;

  const handleLogout = () => {
    resetUserState()
    logout({
      returnTo: window.location.origin,
    })
  }
  if(props?.icon){
    return (
      <Tooltip title="Logout">
        <IconButton icon={props?.icons} size={props?.size} className={props?.className}
          onClick={handleLogout}
        >
          <ExitToApp/>
        </IconButton>
      </Tooltip>
    );
  }else{
    return (
      <Button icon={props?.icons} size={props?.size} className={props?.className}
        onClick={handleLogout}
      >
        {props.text || 'Log out'}
      </Button>
    );
  }
  
};

export default inject((stores) => ({
  flowStore: stores.store.flowStore,
}))(observer(LogoutButton))