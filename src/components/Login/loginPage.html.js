import React from 'react'
import ReCAPTCHA from "react-google-recaptcha"
import ErrorPage from '../infoPages/errorPage'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

function LoginPageHTML(props) {
  if(props.showErrorPage) {
    return (
      <ErrorPage />
    )
  }
  return (
    <div className="AppContainer">
      <div className="AppLogin">

        <Collapse className="wrongCredentials" in={props.authFailed}>
          <Alert variant="filled" severity="error" onClose={props.authFailedErrorClose}> {props.alertMessage} </Alert>
        </Collapse>

        <h1> Authentication </h1>
        <ExitToAppIcon style={{width:"55px", height:"55px"}} />
        <form autoComplete="off" onSubmit={props.onSubmit} className="form">

          {/*Enter email input */}
          <div className="form-group">
            <label htmlFor="email">Email: </label>
            <div className="emailInput">
              <i className="fas fa-user glyphicon"></i>
              <input
                className="form-control"
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
            <label htmlFor="password">Password: </label>
            <div className="passwordInput">
              <i className="fas fa-key glyphicon"></i>
              <i className={props.showHidePassword ? "fas fa-eye glyphiconEye" : "fas fa-eye-slash glyphiconEye" } onClick={props.showHidePasswordFunction}></i>
              <input
                className="form-control password"
                type={props.showHidePassword ? "text" : "password"}
                name="password"
                value={props.password}
                placeholder="Enter password"
                onChange={props.onChange}
              />
              <span>{props.passwordError}</span>
            </div>
            <a className="forgotPassRedirect" href="/forgot-password"> Forgot your password? </a>
          </div>

          {/*I'm not a robot captcha */}
          <div className="captchaContainer">
            <ReCAPTCHA
              className="g-recaptcha"
              sitekey="6Lc3VIEaAAAAAHRD6MB7tYKf2YmE7oY9S3k-pDfe"
              onChange={props.captchaOnChange}
              onExpired={props.captchaExpire}
              hl="en"
            />
            <span>{props.errorCaptcha}</span>
          </div>
          <p className="registerRedirect">
             Don't have an account?
            <a href="/register"> Register </a>
          </p>

          {/*Submit button */}
          <button type="submit" className="btn-primary form-control SubmitButton"> Log in </button> <br />

        </form>
      </div>
    </div>
  )
}
export default LoginPageHTML
