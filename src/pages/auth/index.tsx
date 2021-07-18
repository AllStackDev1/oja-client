import React, { lazy } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Switch, Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

const Login = lazy(() => import('./login'))
const Logout = lazy(() => import('./logout'))
const Register = lazy(() => import('./register'))
const VerifyEmail = lazy(() => import('./verify-email'))
const TwoFactorAuth = lazy(() => import('./two-factor-auth'))

import useAuth from 'context/Auth'

const Auth: React.FC<RouteComponentProps> = (props): JSX.Element => {
  const {
    match: { url },
    history: { push }
  } = props

  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (!isEmpty(isAuthenticated())) {
      push('/dashboard/deals')
    }
  }, [])

  return (
    <Box fontFamily="body" overflowX="hidden">
      <Switch>
        <Redirect exact from={`${url}`} to={`${url}/login`} />
        <Route exact path={`${url}/login`} component={Login} />
        <Route exact path={`${url}/logout`} component={Logout} />
        <Route exact path={`${url}/register`} component={Register} />
        <Route exact path={`${url}/:token`} component={TwoFactorAuth} />
        <Route
          exact
          path={`${url}/verify-email/:token`}
          component={VerifyEmail}
        />
        <Redirect from="*" to="/404" />
      </Switch>
    </Box>
  )
}

export default Auth
