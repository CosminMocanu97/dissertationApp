import React, { useState } from 'react'
import { axiosWrapper } from "../../utils/axiosWrapper"
import '../../stylesheets/registerPage.css'
import '../../stylesheets/common.css'
import RegisterPageHTML from "./registerPage.html"
import { Redirect } from 'react-router'

const minPasswordLength = 6
const EMAIL_REGEX = RegExp(/^[a-zA-Z0-9.!#$%&_]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)

/* function used regarding form validation, checks if the inputs are empty or there are errors and returns false 
otherwise returns true and the form is submitted.*/
export function formValid({ formValidation, email, password, repeatPassword, isVerified }) {
  let valid = true
  Object.values(formValidation).forEach(function (val) {
    if (val.length > 0) {
      valid = false
      return valid
    }
  })
  if (email === "" || password === "" || repeatPassword === "" || isVerified === false) {
    valid = false
  }
  return valid
}

function Register() {
    const [userAlreadyExists, setUserAlreadyExists] = useState(false)
    const defaultErrors = {
      captchaValidation: "",
      emailValidation: "",
      passwordValidation: "",
      repeatPasswordValidation: ""
    }
    const [isVerified, setIsVerified] = useState(false)
    // state for email input that updates on change
    const [email, setEmail] = useState("")
    // state for password input that updates on change
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [formValidation, setFormValidation] = useState(defaultErrors)
    // state to hide/show the password
    const [showPassword, setShowPassword] = useState(false)
    // state to show the error page 
    const [showErrorPage, setErrorPage] = useState(false)
    // state to show the waitActivation page after registering 
    const [showWaitActivationPage, setWaitActivationPage] = useState(false)

  // onSubmit validation - checks if all fields are completed correctly and if they are make post request with the data
  const handleSubmit = (event) => {
    event.preventDefault()
    const stateData = {
      formValidation,
      email,
      password,
      repeatPassword,
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

      if (repeatPassword !== password || repeatPassword.length === 0) {
        errors.repeatPasswordValidation = "This field is empty"
      }
      else {
        errors.repeatPasswordValidation = ""
      }

      if (!isVerified) {
        errors.captchaValidation = "Please check the captcha box"
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
      }
      axiosWrapper.post(`/register`, data)
        .then(() => {
          localStorage.setItem("user_email", data.email)
          setWaitActivationPage(true)
        })
        .catch(error => {
          localStorage.setItem("user_email", data.email)
          if (error.response.status === 409) {
            resetForm()
            window.grecaptcha.reset()
            setUserAlreadyExists(true)
          } 
          else {
            setErrorPage(true)
          }
        })
    }
  }

  /* On change function for real time validation of the input fields it also updates the state variables for the input with what the user types */
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

        if (value !== repeatPassword) {
          errors.repeatPasswordValidation = "Password doesn't match"
        }
        else {
          errors.repeatPasswordValidation = ""
        }
        setFormValidation(errors)
        break

      case 'repeatPassword':
        setRepeatPassword(value)
        if (value !== password) {
          errors.repeatPasswordValidation = "Password doesn't match"
        }
        else {
          errors.repeatPasswordValidation = ""
        }
        setFormValidation(errors)
        break

      default:
        break
    }
  }

  /* A function that resets the form if the user changes the language */
  const resetForm = () => {
    setUserAlreadyExists(false)
    setEmail("")
    setPassword("")
    setRepeatPassword("")
    setIsVerified(false)
    setFormValidation(defaultErrors)
  }

  //function that validates if the captcha box was checked
  const verifyCallback = () => {
    let errors = {...formValidation}
    errors.captchaValidation = ""
    setFormValidation(errors)
    setIsVerified(true)
  }

  //function that doesn't permit form validation if the captcha expired
  const verifyExpired = () =>  {
    setIsVerified(false)
  }

  //function to show/hide the password
  const showOrHidePassword = () => {
    setShowPassword(!showPassword)
  }

  //function that closes the User already exists error (when user presses on X)
  const closeUserExistsError = () => {
    setUserAlreadyExists(false)
  }

  let sessionActive = localStorage.getItem("session_active")
  // if an user is loged in, redirect to the main page when they try to access the /register page
  if (sessionActive !== null || sessionActive === false) {
    return <Redirect to="/user" />
  }
  return (
    <RegisterPageHTML
      onChange={handleChange}
      onSubmit={handleSubmit}
      email={email}
      password={password}
      repeatPassword={repeatPassword}
      captchaOnChange={verifyCallback}
      captchaExpire={verifyExpired}
      emailError={formValidation.emailValidation}
      passwordError={formValidation.passwordValidation}
      errorCaptcha={formValidation.captchaValidation}
      repeatPasswordError={formValidation.repeatPasswordValidation}
      userAlreadyExists={userAlreadyExists}
      userAlreadyExistsClose={closeUserExistsError}
      showHidePasswordFunction = {showOrHidePassword}
      showHidePassword = {showPassword}
      showErrorPage = {showErrorPage}
      showWaitActivationPage = {showWaitActivationPage}
    />
  )
}

export default Register
