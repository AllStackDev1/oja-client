import React from 'react'
import { Switch, Redirect, Route, RouteComponentProps } from 'react-router-dom'

import Splash from 'components/Loading/Splash'

import Auth from 'pages/auth'
import Landing from 'pages/landing'
// import Dashboard from 'pages/dashboard'
import NotFound from 'pages/404'

// import PrivateRoute from './private'
// {/* <PrivateRoute path='/dashboard' component={Dashboard} /> */}

const Router = (): JSX.Element => {
  return (
    <React.Suspense fallback={<Splash />}>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/404" component={NotFound} />
        <Route path="/" component={Landing} />
      </Switch>
    </React.Suspense>
  )
}

export default Router