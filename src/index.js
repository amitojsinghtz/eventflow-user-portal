import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import history from './utils/history';
import { Auth0Provider } from "@auth0/auth0-react";
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './store/reducer';
//import reportWebVitals from './reportWebVitals';
const onRedirectCallback = (appState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
        <App history={history}/>
      </Auth0Provider>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
