import React, { Component } from 'react'
import '../../stylesheets/registerPage.css'
import '../../stylesheets/common.css'
import ReCAPTCHA from "react-google-recaptcha"

const EMAIL_REGEX = RegExp(/^[a-zA-Z0-9.!#$%&_]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)
const minPasswordLength = 6

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
/* A function that resets the form if the user changes the language */
function resetForm(param) {
  param.formValidation.captchaValidation = ""
  param.formValidation.emailValidation = ""
  param.formValidation.passwordValidation = ""
  param.formValidation.repeatPasswordValidation = ""
  param.email = ""
  param.password = ""
  param.repeatPassword = ""
  param.isVerified = false
}

export class Register extends Component {
  /* It used for initializing the local state of the component by assigning an object to this.state.
     It used for binding event handler methods that occur in your component. */
  constructor(props) {
    //used to acces variables from the parent class, in this case we need it in order to use this.state
    super(props)

    this.state = {
      //userAlreadyExists: false,
      formValidation: {
        captchaValidation: "",
        emailValidation: "",
        passwordValidation: "",
        repeatPasswordValidation: "",
      },
      isVerified: false,
      email: "",
      password: "",
      repeatPassword: "",
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
        errorMessage.emailValidation = "Emailul introdus este invalid"
      }

      if (item.password.length >= minPasswordLength) {
        errorMessage.passwordValidation = ""
      }
      else {
        errorMessage.passwordValidation = "Parola trebuie sa conțină minim 6 caractere"
      }

      if ( (item.repeatPassword === item.password) && (item.repeatPassword.length > 0) ) {
        errorMessage.repeatPasswordValidation = ""
      }
      else {
        errorMessage.repeatPasswordValidation = "Parola nu corespunde"
      }

      if (item.isVerified === false) {
        item.formValidation.captchaValidation = "Trebuie să bifați căsuța captcha"
      }
      else {
        item.formValidation.captchaValidation = ""
      }
    } else {
      alert("Register succesful!")
      resetForm(this.state)
      window.grecaptcha.reset()
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
          errorMessage.passwordValidation = "Parola trebuie sa conțină minim 6 caractere"
        }

        if (value === this.state.repeatPassword) {
          errorMessage.repeatPasswordValidation = ""
        }
        else {
          errorMessage.repeatPasswordValidation = "Parola nu corespunde"
        }
        break

      case 'repeatPassword':
        if (value === this.state.password ) {
          errorMessage.repeatPasswordValidation = ""
        }
        else {
          errorMessage.repeatPasswordValidation = "Parola nu corespunde"
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
        <div className="AppRegister"> 
    
           { /* <Collapse className="userExists" in={props.userAlreadyExists}>
            <Alert variant= "filled" severity="error" onClose={props.userAlreadyExistsClose}> {props.userAlreadyExistsMessage} </Alert>
           </Collapse>  */}
    
            <h1>Creează un cont</h1>

            <form autoComplete="off" onSubmit = {this.handleSubmit} className="form">
              
            {/*Enter email input */}
              <div className="form-group">
                <label htmlFor="email">Email: </label>
                <div className="emailInput">
                  <i className="fas fa-user glyphicon"></i>
                  <input
                    className="form-control email"
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
                <label htmlFor="password">Parola: </label>
                <div className="passwordInput">
                  <i className="fas fa-key glyphicon"></i>
                  <input
                    className="form-control password"
                    type="password"
                    name="password"
                    value = {this.state.password}
                    placeholder="Alege o parolă"
                    onChange = {this.handleChange}
                  />
                    <span>{this.state.formValidation.passwordValidation}</span>
                </div>
              </div>
    
            {/*Enter repeat password input */}
              <div className="form-group">
                <label htmlFor="repeatPassword">Repetă parola:</label>
                <div className="repeatPasswordInput">
                  <i className="fas fa-key glyphicon"></i>
                  <input
                    className="form-control repeatPassword"
                    type="password"
                    name="repeatPassword"
                    value= {this.state.repeatPassword}
                    placeholder="Repetați parola"
                    onChange = {this.handleChange}
                     />
                      <span>{this.state.formValidation.repeatPasswordValidation}</span>
                </div>
                <p className = "loginRedirect">
                  Aveți deja cont?
                  <a href="/login"> Autentificați-vă</a>
                 </p>
              </div>
    
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
              <button type="submit" className="btn-primary form-control SubmitButton"> Înregistrare </button> <br />
              
            </form> 
          </div>
        </div>
      )
  }
}
export default Register
