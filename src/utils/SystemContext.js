import React from 'react';

const SystemContext = React.createContext(null);

const SystemProvider = (props) => {
  return (
    <SystemContext.Provider value={props.value}>
      {props.children}
    </SystemContext.Provider>
  );
}

export { SystemContext, SystemProvider };