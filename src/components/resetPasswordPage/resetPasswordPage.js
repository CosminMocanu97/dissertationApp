import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { useParams } from "react-router-dom"
import ResetPasswordHTML from "./resetPassword.html"
import { axiosWrapper } from "../../utils/axiosWrapper"

const minPasswordLength = 6

/* function that checks the validity of the form - returns true if there are no ERRORS (each field from validationState object is empty), if the 
fields are not empty and captcha is checked */
export function formValid({ validationState, password, repeatPassword, isVerified }) {
  let valid = true
  Object.values(validationState).forEach(function (val) {
    if (val.length > 0) {
      valid = false
      return valid
    }
  })
  if (password === "" || repeatPassword === "" || isVerified === false) {
    valid = false
  }
  return valid
}

function ResetPassword(props) {
  // retrieve the token from the request
  const { token } = useParams();
  // state for validation, storing the potential errors for password, repeatPassword and captcha
  const defaultFormValidation = {
    passwordValidation: "",
    repeatPasswordValidation: "",
    captchaValidation: ""
  }
  const [validationState, setValidation] = useState(defaultFormValidation)
  // default empty values for all fields 
  const defaultPassword = "";
  const defaultRepeatPassword = "";
  // state that stores the password
  const [password, setPassword] = useState(defaultPassword);
  // state that stores repeatPassword
  const [repeatPassword, setRepeatPassword] = useState(defaultRepeatPassword)
  // state that stores if captcha is checked or not (true/false)
  const [isVerified, setIsVerfied] = useState(false)
  // state to hide/show the password
  const [showPassword, setShowPassword] = useState(false)
  // state variable used to show the confirmation page if the form succesfully submitted 
  const [isFormSubmittedSuccesfully, setIsFormSubmittedSuccesfully] = useState(false)
  // state variable that renders token is invalid for 401
  const [isTokenValid, setIsTokenValid] = useState(true)
  // state to show the error page 
  const [showErrorPage, setErrorPage] = useState(false)

  // onSubmit validation - checks if all fields are completed correctly and if they are make post request with the data
  const handleSubmit = (event) => {
    event.preventDefault()

    const stateData = {
      validationState,
      password,
      repeatPassword,
      isVerified
    }
    let errors = { ...validationState }

    if (!formValid(stateData)) {

      if (password >= minPasswordLength) {
        errors.passwordValidation = ""
      }
      else {
        errors.passwordValidation = "Password must be at least 6 characters long"
      }

      if (repeatPassword !== password || repeatPassword.length === 0) {
        errors.repeatPasswordValidation = "This field is empty"
      }
      else {
        errors.repeatPasswordValidation = ""
      }

      if (isVerified === false) {
        errors.captchaValidation = "Please check the captcha box"
      }
      else {
        errors.captchaValidation = ""
      }
      setValidation(errors)
    } else {
      const data = {
        password: password
      }
      axiosWrapper.post('/renew-password/' + token, data)
        .then(res => {
          // set the flag to true if the form is submitted succesfully and render the confirmation page
          setIsFormSubmittedSuccesfully(true)
        })
        .catch(function (error) {
          if (error.response.status === 400) {
            // if the response code is 400 it means that the request is not formatted correctly
            resetForm()
            alert("Parola introdusa de dumnevoastra nu este valida")
          } 
          else if (error.response.status === 401) {
            // if the response code is 401 it means that the token is not correct
            setIsTokenValid(false)
          }
          else {
            setErrorPage(true)
          }
        })
    }
  }

  /* real time validation of the input fields. On every element on which we use onChange event, this function
  keeps track of the value inside that element and updates STATE accordingly */
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    let errors = { ...validationState }

    switch (name) {
      case 'password':
        setPassword(value)
        if (value.length >= minPasswordLength) {
          errors.passwordValidation = ""
        }
        else {
          errors.passwordValidation = "Password must be at least 6 characters long"
        }

        if (value === repeatPassword) {
          errors.repeatPasswordValidation = ""
        }
        else {
          errors.repeatPasswordValidation = "Password doesn't match"
        }
        setValidation(errors)
        break

      case 'repeatPassword':
        setRepeatPassword(value)
        if (value === password) {
          errors.repeatPasswordValidation = ""
        }
        else {
          errors.repeatPasswordValidation =  "Password doesn't match"
        }
        setValidation(errors)
        break

      default:
        break
    }
  }

  /* A function that resets the form if the user changes the language */
  const resetForm = () => {
    setValidation(defaultFormValidation)
    setPassword(defaultPassword)
    setRepeatPassword(defaultRepeatPassword)
    setIsVerfied(false)
  }

  /*function to show/hide the password*/
  const showOrHidePassword = () => {
      setShowPassword(!showPassword)
  }

  //function that validates if the captcha box was checked
  const verifyCallback = () => {
    let errors = { ...validationState }
    errors.captchaValidation = ""
    setValidation(errors)
    setIsVerfied(true)
  }

  //function that doesn't permit form validation if the captcha expired
  const verifyExpired = () => {
    setIsVerfied(false)
  }

  let sessionActive = localStorage.getItem("session_active")
  // if an user is loged in, redirect to the main page when they try to access the /forget-password page
  if (sessionActive !== null || sessionActive === false) {
    return <Redirect to="/user" />
  }

  // fields passed to the resetPassPage.html using props
  return (
    <ResetPasswordHTML

      onChange={handleChange}
      onSubmit={handleSubmit}
      captchaOnChange={verifyCallback}
      captchaExpire={verifyExpired}
      password={password}
      repeatPassword={repeatPassword}
      errorCaptcha={validationState.captchaValidation}
      repeatPasswordError={validationState.repeatPasswordValidation}
      passwordError={validationState.passwordValidation}
      showHidePasswordFunction = {showOrHidePassword}
      showHidePassword = {showPassword}
      isFormSubmittedSuccesfully = {isFormSubmittedSuccesfully}
      isTokenValid = {isTokenValid}
      showErrorPage = {showErrorPage}
    />
  )
}

export default ResetPassword
