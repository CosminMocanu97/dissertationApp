import React, { useState } from 'react'
import { Redirect } from 'react-router'
import '../../stylesheets/loginPage.css'
import '../../stylesheets/common.css'
import LoginPageHTML from "../Login/loginPage.html"
import { axiosWrapper } from "../../utils/axiosWrapper"

const minPasswordLength = 6
const EMAIL_REGEX = RegExp(/^[a-zA-Z0-9.!#$%&_]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)

/* function used regarding form validation, checks if the inputs are empty or there are errors and returns false 
otherwise returns true and the form is submitted.*/
export function formValid({ formValidation, email, password, isVerified }) {
  let valid = true
  Object.values(formValidation).forEach(function (val) {
    if (val.length > 0) {
      valid = false
      return valid
    }
  })
  if (email === "" || password === "" || isVerified === false) {
    valid = false
  }
  return valid
}

function Login(props) {
    // if authFailed is true, display an error saying that the password or email are incorrect 
    const [authFailed, setAuthFailed] = useState(false)
    // variable used to keep track if captcha is checked or not
    const [isVerified, setIsVerified] = useState(false)
    // state for email input that updates on change
    const [email, setEmail] = useState("")
    // state for password input that updates on change
    const [password, setPassword] = useState("")
    // object that handles the errors displayed under the input fields
    const defaultErrors = {
      captchaValidation: "",
      emailValidation: "",
      passwordValidation: ""
    }
    const [formValidation, setFormValidation] = useState(defaultErrors)
    // use to determine what message the alert should display based on response (400/417 etc)
    const [alertMessage, setAlertMessage] = useState("")
    // state to hide/show the password
    const [showPassword, setShowPassword] = useState(false)
    // state to show the error page 
    const [showErrorPage, setErrorPage] = useState(false)

  // onSubmit validation - checks if all fields are completed correctly and if they are make post request with the data
  const handleSubmit = (event) => {
    event.preventDefault()
    const stateData = { 
      formValidation,
      email,
      password,
      isVerified
    }
    let errors = {...formValidation}

    if (!formValid(stateData)) {

      if (!EMAIL_REGEX.test(email.trim())) {
        errors.emailValidation = "Invalid email address (e.g. example@domain.com)"
      }
      else {
        errors.emailValidation = ""
      }

      if (password < minPasswordLength) {
        errors.passwordValidation = "Password must be at least 6 characters long"
      }
      else {
        errors.passwordValidation = ""
      }

      if (!isVerified) {
        errors.captchaValidation = " Please check the captcha box"
      }
      else {
        errors.captchaValidation = ""
      }
      setFormValidation(errors)
    } 
    
    else {
      const data = {
        email: email.trim(),
        password: password
      };

      axiosWrapper.post(`/login`, data)
        .then(res => {
          // if the user manages to log in, store his id and JWT to be used on all the pages and mark that there is an active session 
          localStorage.setItem("session_active", true)
          localStorage.setItem("user_id", res.data["id"])
          localStorage.setItem("jwt", res.data["token"])
          localStorage.setItem("role", res.data["role"])
          localStorage.setItem("user_email", data.email)
          window.location = "/user"
        })
        .catch(error => {
          if (error.response.status === 400 || error.response.status === 401) {
            resetForm()
            window.grecaptcha.reset()
            setAuthFailed(true)
            setAlertMessage("Wrong email or password")
          } else if (error.response.status === 403) {
            resetForm()
            window.grecaptcha.reset()
            setAuthFailed(true)
            setAlertMessage("Please activate your account")
          } else if (error.response.status === 417) {
            resetForm()
            window.grecaptcha.reset()
            setAuthFailed(true)
            setAlertMessage("This account doesn't exist")
          } else {
            setErrorPage(true)
          }
        })
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    let errors = {...formValidation}

    switch (name) {
      case 'email':
        setEmail(value)
        if (!EMAIL_REGEX.test(value.trim())) {
          errors.emailValidation = "Invalid email address (e.g. example@domain.com)"
        }
        else {
          errors.emailValidation = ""
        }
        setFormValidation(errors)
        break

      case 'password':
        setPassword(value)
        if (value.length < minPasswordLength) {
          errors.passwordValidation = "Password must be at least 6 characters long"
        }
        else {
          errors.passwordValidation = ""
        }
        setFormValidation(errors)
        break

      default:
        break
    }
  }

  /* A function that resets the form if the user changes the language */
  const resetForm = () => {
    setEmail("")
    setPassword("")
    setAuthFailed(false)
    setIsVerified(false)
    setFormValidation(defaultErrors)
    setAlertMessage("")
  }

  //function that validates if the captcha box was checked
  const verifyCallback = () => {
    let errors = {...formValidation}
    errors.captchaValidation = ""
    setFormValidation(errors)
    setIsVerified(true)
  }

  //function that doesn't permit form validation if the captcha expired
  const verifyExpired = () => {
    setIsVerified(false)
  }

  //function to show/hide the password
  const showOrHidePassword = () => {
    setShowPassword(!showPassword)
  }

  //function that closes the User already exists error (when user presses on X)
  const closeAuthFailerError = () => {
    setAuthFailed(false)
  }

  let sessionActive = localStorage.getItem("session_active")
  // if an user is logged in, redirect to the main page when they try to access the /login page
  if (sessionActive !== null || sessionActive === false) {
    return <Redirect to="/user" />
  }
  return (
    <LoginPageHTML
      onChange={handleChange}
      onSubmit={handleSubmit}
      email={email}
      password={password}
      authFailed={authFailed}
      authFailedErrorClose={closeAuthFailerError}
      alertMessage = {alertMessage}
      captchaOnChange={verifyCallback}
      captchaExpire={verifyExpired}
      emailError={formValidation.emailValidation}
      passwordError={formValidation.passwordValidation}
      errorCaptcha={formValidation.captchaValidation}

      showHidePasswordFunction = {showOrHidePassword}
      showHidePassword = {showPassword}
      showErrorPage = {showErrorPage}
    />
  )
}


export default Login
