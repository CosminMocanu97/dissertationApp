import React, { Component } from 'react'
import '../../stylesheets/loginPage.css'
import '../../stylesheets/common.css'
import ReCAPTCHA from "react-google-recaptcha"
import { axiosWrapper } from "../../utils/axiosWrapper"

const EMAIL_REGEX = RegExp(/^[a-zA-Z0-9.!#$%&_]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)
const minPasswordLength = 6

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
/* A function that resets the form if the user changes the language */
function resetForm(param) {
  param.formValidation.captchaValidation = ""
  param.formValidation.emailValidation = ""
  param.formValidation.passwordValidation = ""
  param.email = ""
  param.password = ""
  param.isVerified = false
}

export class Login extends Component {
  /* It used for initializing the local state of the component by assigning an object to this.state.
     It used for binding event handler methods that occur in your component. */
  constructor(props) {
    //used to acces variables from the parent class, in this case we need it in order to use this.state
    super(props)

    this.state = {
      // if authFailed is true, display an error saying that the password or email are incorrect 
      authFailed: false,
      formValidation: {
        captchaValidation: "",
        emailValidation: "",
        passwordValidation: ""
      },
      isVerified: false,
      email: "",
      password: ""
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.verifyCallback = this.verifyCallback.bind(this)
    this.verifyExpired = this.verifyExpired.bind(this)
  }

 // on submit function
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

      if (item.password.length >= minPasswordLength) {
        errorMessage.passwordValidation = ""
      }
      else {
        errorMessage.passwordValidation = "Vă rugâm introduceți parola"
      }

      if (item.isVerified === false) {
        item.formValidation.captchaValidation = "Trebuie să bifați căsuța captcha"
      }
      else {
        item.formValidation.captchaValidation = ""
      }
    } else {
      const data = {
        email: this.state.email,
        password: this.state.password
      };

      axiosWrapper.post(`/login`, data)
        .then(res => {
          // if the user manages to log in, store his id and JWT to be used on all the pages and mark that there is an active session 
          localStorage.setItem("session_active", true)
          localStorage.setItem("user_id", res.data["id"])
          localStorage.setItem("jwt", res.data["token"])
          localStorage.setItem("user_email", data.email)
          console.log(res.data)
          window.location = "/user"
        })
        .catch(error => {
          // if the credentials are invalid, redirect the user to the login page and tell them that the password or email are incorrect
          if (error.response.status === 400 || error.response.status === 401) {
            resetForm(this.state)
            window.grecaptcha.reset()
            this.setState({ authFailed: true })
          } else if (error.response.status === 417) {
            // todo: redirect to a page that says that the account is not activated and has a button to re-submit the activation email for am email written in a form
            alert("contul dummneavoastra nu a fost activat")
          } else {
            window.location = "/error"
          }
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

      case 'password':
        if (value.length >= minPasswordLength) {
          errorMessage.passwordValidation = ""
        }
        else {
          errorMessage.passwordValidation = "Parola invalidă"
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
          <div className="AppLogin"> 
      
              <h1>Autentificare</h1>
              <form autoComplete="off" onSubmit = {this.handleSubmit} className="form">
                
              {/*Enter email input */}
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
      
              {/*Enter password input */}
                <div className="form-group">
                  <label htmlFor="password">Parola:</label>
                  <div className="passwordInput">
                    <i className="fas fa-key glyphicon"></i>
                    <input
                      className="form-control password"
                      type="password"
                      name="password"
                      value = {this.state.password}
                      placeholder="Adaugă parola"
                      onChange = {this.handleChange}
                    />
                     <span>{this.state.formValidation.passwordValidation}</span>
                  </div>    
                  <a className = "forgotPassRedirect" href="/forgot-password"> Ai uitat parola ? </a> 
                </div>
      
              {/*I'm not a robot captcha */} 
                  <div className = "captchaContainer">
                    <ReCAPTCHA
                    className ="g-recaptcha"
                    sitekey="6LfJ0O0UAAAAAGuWBw9pHnOIArMdlFNkX1BqH34m"
                    onChange={this.verifyCallback}
                    onExpired={this.verifyExpired}
                    hl = "ro"
                    />
                    <span>{this.state.formValidation.captchaValidation}</span>
                  </div> 
                  <p className ="registerRedirect">
                    Nu ai cont?
                    <a href="/register"> Înregistrează-te </a>
                  </p>
                
              {/*Submit button */}
                <button type="submit" className="btn-primary form-control SubmitButton"> Intră în cont </button> <br />
      
              </form> 
            </div>
          </div>
        )
  }
}


export default Login
