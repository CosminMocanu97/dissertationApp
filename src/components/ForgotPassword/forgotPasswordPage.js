import React, { Component } from 'react'
import '../../stylesheets/forgotPasswordPage.css'
import '../../stylesheets/common.css'
import ReCAPTCHA from "react-google-recaptcha"
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

export class ForgotPassword extends Component {
  /* It used for initializing the local state of the component by assigning an object to this.state.
     It used for binding event handler methods that occur in your component. */
  constructor(props) {
    //used to acces variables from the parent class, in this case we need it in order to use this.state
    super(props)

    this.state = {
      formValidation: {
        captchaValidation: "",
        emailValidation: "",
      },
      isVerified: false,
      email: ""
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.verifyCallback = this.verifyCallback.bind(this)
    this.verifyExpired = this.verifyExpired.bind(this)
  }

  handleSubmit(event) {
    const name = event.target.name
    const value = event.target.value
    const errorMessage = this.state.formValidation
    const item = this.state

    this.setState({ [name]: value })
    event.preventDefault()

    if (!formValid(item)) {
      if (EMAIL_REGEX.test(item.email)) {
        errorMessage.emailValidation = ""
      }
      else {
        errorMessage.emailValidation = "Adresa de email este obligatorie"
      }

      if (item.isVerified === false) {
        item.formValidation.captchaValidation = "Trebuie să bifați căsuța captcha"
      }
      else {
        item.formValidation.captchaValidation = ""
      }
    } else {
      const data = {
        email: item.email
      }
      axiosWrapper.post("/forgot-password", data)
        .then(res => {
          localStorage.setItem("email", item.email)
          window.location = "/confirmation"
        })
        .catch(error => {
          window.location = "/error"
        })
    }
  }

  /* real time validation of the input fields. On every element on which we use onChange event, this function
  keeps track of the value inside that element and updates STATE accordingly */
  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const errorMessage = this.state.formValidation
    this.setState({ [name]: value })

    switch (name) {
      case 'email':
        if (EMAIL_REGEX.test(value)) {
          errorMessage.emailValidation = ""
        }
        else {
          errorMessage.emailValidation = "Emailul introdus este invalid"
        }
        break

      default:
        break
    }
  }

  //function that validates if the captcha box was checked
  verifyCallback() {
    const errorMessage = this.state.formValidation
    errorMessage.captchaValidation = ""

    this.setState({
      isVerified: true
    })
  }

  //function that doesn't permit form validation if the captcha expired
  verifyExpired() {
    this.setState({
      isVerified: false
    })
  }

  render() {
    return (
        <div className = "AppContainer">
          <div className="AppForgetPass"> 
         
            <h1> Resetare parolă </h1>

            <form autoComplete="off" onSubmit = {this.handleSubmit} className="form">
            {/* Enter email input */}
              <div className="form-group">
                <label htmlFor="email">Email: </label>
                <div className="emailInput">
                  <i className="fas fa-user glyphicon"></i>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    value = {this.state.email}
                    placeholder="Adaugă email" 
                    onChange = {this.handleChange}
                  />
                    <span>{this.state.formValidation.emailValidation}</span>
                </div>
              </div>
                <p className ="loginRedirect">
                  V-ați amintit parola? 
                  <a href="/login" > Autentificați-vă</a>
                </p>
            {/*I'm not a robot captcha */} 
              <div className = "captchaContainer">
                <ReCAPTCHA
                className =" g-recaptcha "
                sitekey="6LfJ0O0UAAAAAGuWBw9pHnOIArMdlFNkX1BqH34m"
                onChange={this.verifyCallback}
                onExpired={this.verifyExpired}
                hl = "ro"
                />
                  <span>{this.state.formValidation.captchaValidation}</span> 
              </div> 
            {/*Submit button */}
              <button type="submit" className="btn-primary form-control SubmitButton"> Resetează parola </button> <br />
            </form> 
          </div>
        </div>
        )
  }
}
export default ForgotPassword
