import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { useParams } from "react-router-dom"
import '../../stylesheets/resetPasswordPage.css'
import '../../stylesheets/common.css'
import ReCAPTCHA from "react-google-recaptcha"
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
  // state that stores the password
  const [password, setPassword] = useState("");
  // state that stores repeatPassword
  const [repeatPassword, setRepeatPassword] = useState("")
  // state that stores if captcha is checked or not (true/false)
  const [isVerified, setIsVerfied] = useState(false)

  // onSubmit validation - checks if all fields are completed correctly and if they are make POST request with the data
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
        setValidation(errors)
      }
      else {
        errors.passwordValidation = "Parola trebuie sa conțină minim 6 caractere"
        setValidation(errors)
      }

      if (repeatPassword === password && repeatPassword > 0) {
        errors.repeatPasswordValidation = ""
        setValidation(errors)
      }
      else {
        errors.repeatPasswordValidation = "Parola nu corespunde"
        setValidation(errors)
      }

      if (isVerified === false) {
        errors.captchaValidation = "Trebuie să bifați căsuța captcha"
        setValidation(errors)
      }
      else {
        errors.captchaValidation = ""
        setValidation(errors)
      }

    } else {
      const data = {
        "password": password
      }
      axiosWrapper.post('/renew-password/' + token, data)
        .then(res => {
          alert("Parola a fost resetata, acum va puteti loga cu noua parola")
          window.location = "/login"
        })
        .catch(function (error) {
          if (error.response.status === 400) {
            // if the response code is 400 it means that the request is not formatted correctly
            alert("Parola introdusa de dumnevoastra nu este valida")
          } else if (error.response.status === 401) {
            // if the response code is 401 it means that the token is not correct
            alert("Link-ul de activare nu este corect, va rugam reincercati sa resetati parola")
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
          setValidation(errors)
        }
        else {
          errors.passwordValidation = "Parola trebuie sa conțină minim 6 caractere"
          setValidation(errors)
        }

        if (value === repeatPassword) {
          errors.repeatPasswordValidation = ""
          setValidation(errors)
        }
        else {
          errors.repeatPasswordValidation = "Parola nu corespunde"
          setValidation(errors)
        }
        break

      case 'repeatPassword':
        setRepeatPassword(value)
        if (value === password) {
          errors.repeatPasswordValidation = ""
          setValidation(errors)
        }
        else {
          errors.repeatPasswordValidation = "Parola nu corespunde" 
          setValidation(errors)
        }
        break

      default:
        break
    }
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
    <div className="AppContainer">
      <div className="AppResetPasswordPage">
        <h1> Modificare parolă </h1>

        <form autoComplete="off" onSubmit={handleSubmit} className="form">
          {/* New password input */}
          <div className="form-group">
            <label htmlFor="password">Parola nouă:</label>
            <div className="passwordInput">
              <i className="fas fa-key glyphicon"></i>
              <input
                className="form-control password"
                type="password"
                name="password"
                value={password}
                placeholder="Alege parola nouă"
                onChange={handleChange}
              />
              <span>{validationState.passwordValidation}</span>
            </div>
            <a className="forgotPassRedirect" href="/forgot-password"> Restează parola </a>
          </div>

          <div className="form-group">
            <label htmlFor="repeatPassword">Repetă parola nouă: </label>
            <div className="repeatPasswordInput">
              <i className="fas fa-key glyphicon"></i>
              <input
                className="form-control repeatPassword"
                type="password"
                name="repeatPassword"
                value={repeatPassword}
                placeholder="Repetă parola nouă"
                onChange={handleChange}
              />
              <span>{validationState.repeatPasswordValidation}</span>
            </div>
          </div>

          <p className="loginRedirect">
            Ți-ai amintit parola ?
            <a href="/login" > Intră în cont </a>
          </p>
          {/*I'm not a robot captcha */}
          <div className="captchaContainer">
            <ReCAPTCHA
              className=" g-recaptcha "
              sitekey="6Lc3VIEaAAAAAHRD6MB7tYKf2YmE7oY9S3k-pDfe"
              onChange={verifyCallback}
              onExpired={verifyExpired}
              hl="en"
            />
            <span>{validationState.captchaValidation}</span>
          </div>
          {/*Submit button */}
          <button type="submit" className="btn-primary form-control SubmitButton"> Resetează parola </button> <br />
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
