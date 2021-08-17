import React from 'react'
import ReCAPTCHA from "react-google-recaptcha"
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'
import ErrorPage from '../infoPages/errorPage'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import WaitActivationPage from '../infoPages/waitAccountActivationPage'

function RegisterPageHTML(props) {
  if(props.showErrorPage) {
    return (
      <ErrorPage />
    )
  }
  else if(props.showWaitActivationPage) {
    return (
      <WaitActivationPage />
    )
  }
  return (
    <div className="AppContainer">
      <div className="AppRegister">

        <Collapse className="userExists" in={props.userAlreadyExists}>
          <Alert variant="filled" severity="error" onClose={props.userAlreadyExistsClose}> Email already associated with an account </Alert>
        </Collapse>

        <h1> Create an account </h1>
        <PersonAddIcon style = {{ width:"60px", height:"60px"}} />
        <form autoComplete="off" onSubmit={props.onSubmit} className="form">

          {/*Enter email input */}
          <div className="form-group">
            <label htmlFor="email">Email: </label>
            <div className="emailInput">
              <i className="fas fa-user glyphicon"></i>
              <input
                className="form-control email"
                type="text"
                name="email"
                value={props.email}
                placeholder="Enter email"
                onChange={props.onChange}
              />
              <span>{props.emailError}</span>
            </div>
          </div>

          {/*Enter password input */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="passwordInput">
              <i className="fas fa-key glyphicon"></i>
              <i className={props.showHidePassword ? "fas fa-eye glyphiconEye" : "fas fa-eye-slash glyphiconEye" } onClick={props.showHidePasswordFunction}></i>
              <input
                className="form-control password"
                type={props.showHidePassword ? "text" : "password"}
                name="password"
                value={props.password}
                placeholder= "Choose a password"
                onChange={props.onChange}
              />
              <span>{props.passwordError}</span>
            </div>
          </div>

          {/*Enter repeat password input */}
          <div className="form-group">
            <label htmlFor="repeatPassword">Repeat password: </label>
            <div className="repeatPasswordInput">
              <i className="fas fa-key glyphicon"></i>
              <input
                className="form-control repeatPassword"
                type={props.showHidePassword ? "text" : "password"}
                name="repeatPassword"
                value={props.repeatPassword}
                placeholder= "Repeat your password"
                onChange={props.onChange}
              />
              <span>{props.repeatPasswordError}</span>
            </div>
          </div>

          {/*I'm not a robot captcha */}
          <div className="captchaContainer" style={{ marginBottom: 3 }}>
            <ReCAPTCHA
              className=" g-recaptcha "
              sitekey="6Lc3VIEaAAAAAHRD6MB7tYKf2YmE7oY9S3k-pDfe"
              onChange={props.captchaOnChange}
              onExpired={props.captchaExpire}
              hl="en"
            />
            <span>{props.errorCaptcha}</span>
          </div>

          <p className="loginRedirect">
              Already have an account?
              <a href="/login"> Log in </a>
          </p>
         
          {/*Submit button */}
          <button type="submit" className="btn-primary form-control SubmitButton"> Register now </button> <br />

        </form>
      </div>
    </div>
  )
}
export default RegisterPageHTML
