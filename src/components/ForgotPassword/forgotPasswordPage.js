import React, { useState } from 'react'
import { Redirect } from 'react-router'
import ForgetPasswordHTML from "./forgotPassword.html"
import '../../stylesheets/forgotPasswordPage.css'
import '../../stylesheets/common.css'
import { axiosWrapper } from "../../utils/axiosWrapper"

const EMAIL_REGEX = RegExp(/^[a-zA-Z0-9.!#$%&_]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)

/* function used regarding form validation, checks if the inputs are empty or there are errors and returns false 
otherwise returns true and the form is submitted.*/
export function formValid({ formValidation, email, isVerified }) {
  let valid = true
  Object.values(formValidation).forEach(function (val) {
    if (val.length > 0) {
      valid = false
      return valid
    }
  })
  if (email === "" || isVerified === false) {
    valid = false
  }
  return valid
}

function ForgotPassword(props) {
  // variable that displays an alert if the email doesn't exist in db (500)
  const [wrongEmailAlert, setWrongEmailAlert] = useState(false)
  // state for email input
  const [email, setEmail] = useState("")
  // state that stores if captcha is checked or not (true/false)
  const [isVerified, setIsVerified] = useState(false)
  // state for validation, storing the potential errors for email and captcha
  const defaultFormValidation = {
    emailValidation: "",
    captchaValidation: ""
  }
  const [formValidation, setFormValidation] = useState(defaultFormValidation)
  // state variable used to show the confirmation page if the form succesfully submitted 
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)
  // state to show the error page 
  const [showErrorPage, setErrorPage] = useState(false)

  /* on submit validation for all fields by displaying errors messages below the inputs when submitting and 
  preventing the FORM from validating
  This is a function that is triggered when an event handler fires, in this case in the form tag we have onSubmit 
  event that is triggered when the submit button is pressed. "event" is an object that has built in functions 
  and methods and gives us information about that specific event that occured, keeps track of where the event occured
  event.target.name - refers to the element on which the event occured - in this case is the "form"
  event.target.value - refers to the value of that form, meaning all the elements inside the form(inputs,buttons etc) 
  When the submit button is pressed we update STATE with the values that were present in the form at the moment of 
  the submit event*/
  const handleSubmit = (event) => {
    event.preventDefault()
    const stateVariables = {
      email,
      isVerified,
      formValidation
    }
    const inputErrors = {...formValidation}

    if (!formValid(stateVariables)) {
      if (!EMAIL_REGEX.test(email.trim())) {
        inputErrors.emailValidation = "Invalid email address (e.g. example@domain.com)"
      }
      else {
        inputErrors.emailValidation = ""
      }

      if (isVerified === false) {
        inputErrors.captchaValidation = "Please check the captcha box"
      }
      else {
        inputErrors.captchaValidation = ""
      }
      setFormValidation(inputErrors)
    } 
    else {
      const data = {
        email: email.trim()
      }
       axiosWrapper.post("/forgot-password", data)
        .then(() => {
          setPasswordResetSuccess(true)
        })
        .catch(error => {
          if (error.response.status === 500) {
            resetForm()
            window.grecaptcha.reset()
            setWrongEmailAlert(true)
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
    let inputErrors = {...formValidation}

    switch (name) {
      case 'email':
        setEmail(value)
        if (!EMAIL_REGEX.test(value.trim())) {
          inputErrors.emailValidation = "Invalid email address (e.g. example@domain.com)"
        }
        else {
          inputErrors.emailValidation = ""
        }
        setFormValidation(inputErrors)
        break

      default:
        break
    }
  }

  /* A function that resets the form if the user changes the language */
  const resetForm = () => {
     setEmail("")
     setIsVerified(false)
     setFormValidation(defaultFormValidation)
     setWrongEmailAlert(false)
  }

  //function that validates if the captcha box was checked
  const verifyCallback = () => {
    let inputErrors = {...formValidation}
    inputErrors.captchaValidation = ""
    setFormValidation(inputErrors)
    setIsVerified(true)
  }

  //function that doesn't permit form validation if the captcha expired
  const verifyExpired = () => {
    setIsVerified(false)
  }

//function that closes error alert when the email provided doesn't exist 
  const closeAlert = ()  => {
    setWrongEmailAlert(false)
}

  let sessionActive = localStorage.getItem("session_active")
  // if an user is logged in, redirect to the main page when they try to access the /forget-password page
  if (sessionActive !== null || sessionActive === false) {
    return <Redirect to="/user" />
  }

  return (
    <ForgetPasswordHTML
      onChange={handleChange}
      onSubmit={handleSubmit}
      captchaOnChange={verifyCallback}
      captchaExpire={verifyExpired}
      email={email}
      errorSpan={formValidation.emailValidation}
      errorCaptcha={formValidation.captchaValidation}
      wrongEmailAlert = {wrongEmailAlert}
      closeAlert = {closeAlert}
      passwordResetSuccess = {passwordResetSuccess}
      showErrorPage = {showErrorPage}
    />
  )
}

export default ForgotPassword
