import React from 'react'
import RootStore from './mobx'
import { Provider } from 'mobx-react'
import { useSelector } from 'react-redux'
import { ThemeProvider, CssBaseline, StyledEngineProvider } from '@material-ui/core'
import { Route, Switch, Redirect, Router, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import theme from './themes'
import GlobalStyles from './theme/GlobalStyles'
import { SystemProvider } from './utils/SystemContext'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { HomePage, NotFoundPage } from './views'

import { FormPage as NewFormPage } from './views/Form'

import MainLayout from './layout/MainLayout'

import EntrantForm from './views/Entrant/EntrantForm'

import SubmissionPage from './views/Submission/SubmissionPage'
import SubmissionList from './views/Submission/SubmissionList'

import CheckoutPage from './views/Payment/CheckoutPage'
import RecordPage from './views/Records/RecordPage'

import { loadState } from './mobx/initial'

import './App.css'

const state = new RootStore()

loadState(state)

const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(withRouter(component))} {...args} />
)

const App = (props) => {
  const customization = useSelector((state) => state.customization)

  return (
    <Provider store={state}>
      <StyledEngineProvider injectFirst>
        <SystemProvider value={{}}>
          <ThemeProvider theme={theme(customization)}>
            <CssBaseline />
            <Helmet>
              <title>{'Haymarket Award System'}</title>
              <meta name="description" content={'Haymarket Award System'} />
            </Helmet>
            <GlobalStyles />

            <Router history={props.history}>
              <MainLayout>
                <Switch>
                  <ProtectedRoute path="/entrant/form" exact component={EntrantForm} />
                  <ProtectedRoute path="/steps/:step" exact component={NewFormPage} />
                  {/* <ProtectedRoute path="/select/:stepId?" exact component={SelectPage} />
                  <ProtectedRoute path="/form/:formId?" exact component={FormPage} />
                  <ProtectedRoute path="/complete" exact component={CompletePage} />
                  <ProtectedRoute path="/cart" exact component={CartPage} />
                  <ProtectedRoute path="/payment/:method" exact component={CartPage} />
                  <ProtectedRoute path="/records" exact component={RecordPage} />
                  <ProtectedRoute path="/edit/:type?" exact component={EditPage} />
                  <ProtectedRoute path="/edit/:type?/complete" exact component={EditPage} />
                  <ProtectedRoute path="/steps/:step" exact component={NewFormPage} /> */}
                  <ProtectedRoute path="/submission/list" exact component={SubmissionList} />
                  <ProtectedRoute path="/submission/form" exact component={SubmissionPage} />
                  <ProtectedRoute path="/checkout/:method" exact component={CheckoutPage} />
                  <ProtectedRoute path="/checkout" exact component={CheckoutPage} />
                  <ProtectedRoute path="/records" exact component={RecordPage} />
                  <Route path="/:awardAlias?" exact component={HomePage} />
                  <Route path="/page/404" component={NotFoundPage} />
                  <Redirect to="/page/404" />
                </Switch>
              </MainLayout>
            </Router>
          </ThemeProvider>
        </SystemProvider>
      </StyledEngineProvider>
    </Provider>
  )
}

export default App
