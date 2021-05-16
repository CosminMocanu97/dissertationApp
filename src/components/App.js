import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Register from './Register/registerPage'
import Login from './Login/loginPage'
import ForgotPassword from "./ForgotPassword/forgotPasswordPage"
import Confirmation from './ForgotPasswordConfirmation/confirmationPage'
import waitAccountActivationPage from './waitAccountActivation/waitAccountActivationPage'
import activateAccountPage from './activateAccountPage/activateAccountPage'
import inexistentPage from './inexistingPage/inexistingPage'
import loggedUserPage from './loggedUserPage/loggedUserPage'
import resetPassPage from './resetPasswordPage/resetPasswordPage'

function ApplicationRoutes() {
  return (
    <Router>
    <Switch>
        <Route path="/" exact component={Register} />
        <Route path="/activate/:token" exact component={activateAccountPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/confirmation" exact component={Confirmation} />
        <Route path="/user" exact component={loggedUserPage} />
        <Route path="/waitAccountActivation" exact component={waitAccountActivationPage} />
        <Route path="/renew-password/:token" exact component={resetPassPage} />
        <Route path='*' component={inexistentPage} />
    </Switch> 
    </Router>
  )
}
export default ApplicationRoutes
