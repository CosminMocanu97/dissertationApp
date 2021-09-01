import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Register from './Register/registerPage'
import Login from './Login/loginPage'
import ForgotPassword from "./ForgotPassword/forgotPasswordPage"
import activateAccountPage from './activateAccountPage/activateAccountPage'
import inexistentPage from './infoPages/inexistentPage'
import loggedUserPage from './loggedUserPage/loggedUserPage'
import resetPassPage from './resetPasswordPage/resetPasswordPage'
import FileModificationPage from './modifyFilePage/fileModification'
import SingleFolderPage from './singleFolderPage/singleFolderPage'
import SingleSubfolderPage from "./singleSubfolderPage/singleSubfolderPage"
import ErrorPage from "./infoPages/errorPage"

function ApplicationRoutes() {
  return (
    <Router>
    <Switch>
        <Route path="/" exact component={Register} />
        <Route path="/activate/:token" exact component={activateAccountPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/user" exact component={loggedUserPage} />
        <Route path="/renew-password/:token" exact component={resetPassPage} />
        <Route path="/user/:folder_id" exact component={SingleFolderPage} />
        <Route path="/user/:folder_id/:subfolder_id" exact component={SingleSubfolderPage} />



        <Route path="/user/:folder_id/:subfolder_id/:file_id" exact component={FileModificationPage} />
        <Route path="/error" exact component={ErrorPage} />
        <Route path='*' component={inexistentPage} />
    </Switch> 
    </Router>
  )
}
export default ApplicationRoutes
