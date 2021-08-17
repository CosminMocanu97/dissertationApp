import React from 'react'
import ReCAPTCHA from "react-google-recaptcha"
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import ForgotPasswordConfirmation from '../infoPages/forgotPasswordConfirmation'
import ErrorPage from '../infoPages/errorPage'
import Collapse from '@material-ui/core/Collapse'
import Alert from '@material-ui/lab/Alert'

function ForgetPasswordHTML(props) {
  if(props.passwordResetSuccess) {
    return (
      <ForgotPasswordConfirmation />
    )
  }
  else if(props.showErrorPage) {
    return (
      <ErrorPage />
    )
  }

  return (
    <div className="AppContainer">
      <div className="AppForgetPass">

        <Collapse className="wrongEmailAlert" in={props.wrongEmailAlert}>
          <Alert variant="filled" severity="error" onClose={props.closeAlert}> The provided email doesn't exist </Alert>
        </Collapse>

        <h1> Trouble with logging in? </h1>
        <LockOutlinedIcon className="lockIcon"/>

        <form autoComplete="off" onSubmit={props.onSubmit} className="form">
          {/* Enter email input */}
          <div className="form-group">
            <label htmlFor="email"> Please enter your email address </label>
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
              <span>{props.errorSpan}</span>
            </div>
          </div>
          <p className="loginRedirect">
            Remember your password? 
            <a href="/login" > Log in </a>
          </p>
          {/*I'm not a robot captcha */}
          <div className="captchaContainer">
            <ReCAPTCHA
              className=" g-recaptcha "
              sitekey="6Lc3VIEaAAAAAHRD6MB7tYKf2YmE7oY9S3k-pDfe"
              onChange={props.captchaOnChange}
              onExpired={props.captchaExpire}
              hl="en"
            />
            <span>{props.errorCaptcha}</span>
          </div>
          {/*Submit button */}
          <button type="submit" className="btn-primary form-control SubmitButton"> Reset password </button> <br />
        </form>
      </div>
    </div>
  )
}
export default ForgetPasswordHTML
