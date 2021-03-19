import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Register from './Register/registerPage'
import Login from './Login/loginPage'
import ForgotPassword from "./ForgotPassword/forgotPasswordPage"
import Confirmation from './ForgotPasswordConfirmation/confirmationPage'
function ApplicationRoutes() {
  return (
    <Router>
    <Switch>
        <Route path="/" exact component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/confirmation" component={Confirmation} />
    </Switch> 
    </Router>
  )
}
export default ApplicationRoutes
