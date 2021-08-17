import React from 'react'
import ReCAPTCHA from "react-google-recaptcha"
import PasswordChangeSuccess from '../infoPages/successResetPassword'
import InvalidLink from '../infoPages/invalidLinkResetPassword'
import ErrorPage from '../infoPages/errorPage'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import '../../stylesheets/resetPasswordPage.css'
import '../../stylesheets/common.css'

function ResetPasswordHTML(props) {

  if(props.isFormSubmittedSuccesfully) {
    return (
      <PasswordChangeSuccess />
    )
  }
  else if(!props.isTokenValid) {
    return (
      <InvalidLink />
    )
  }
  else if(props.showErrorPage) {
    return (
      <ErrorPage />
    )
  }
  return (
    <div className="AppContainer">
      <div className="AppResetPasswordPage">

        <h1> Create a new password </h1>

        <LockOpenIcon className = "lockOpenIcon"/>
        <form autoComplete="off" onSubmit={props.onSubmit} className="form">
          {/* New password input */}
          <div className="form-group">
            <label htmlFor="password"> New password:</label>
            <div className="passwordInput">
              <i className="fas fa-key glyphicon"></i>
              <i className={props.showHidePassword ? "fas fa-eye glyphiconEye" : "fas fa-eye-slash glyphiconEye" } onClick={props.showHidePasswordFunction}></i>
              <input
                className="form-control password"
                type={props.showHidePassword ? "text" : "password"}
                name="password"
                value={props.password}
                placeholder= "Type a new password"
                onChange={props.onChange}
              />
              <span>{props.passwordError}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="repeatPassword"> Repeat new password: </label>
            <div className="repeatPasswordInput">
              <i className="fas fa-key glyphicon"></i>
              <input
                className="form-control repeatPassword"
                type={props.showHidePassword ? "text" : "password"}
                name="repeatPassword"
                value={props.repeatPassword}
                placeholder= "Repeat your new password"
                onChange={props.onChange}
              />
              <span>{props.repeatPasswordError}</span>
            </div>
          </div>

          <p className="loginRedirect">
            Remembered your password ?
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
export default ResetPasswordHTML
