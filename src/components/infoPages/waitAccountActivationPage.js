
import React from 'react'
import { Alert } from "react-bootstrap"
import '../../stylesheets/waitActivation.css'
import '../../stylesheets/common.css'

const WaitAccountActivationPage = () => {
  // retrieve the email to be activated
  const email = localStorage.getItem("user_email");
  if (email === null) {
    window.location = "/inexistent-page"
  }
  return (
    <div className="AppContainer">
      <Alert variant="success" className="AppWaitActivation">
        <Alert.Heading> Account created successfully!</Alert.Heading>
        <p>
          To activate your account, please check the email address <span className="userEmail">{email}</span>.
        </p>
        <hr />
        <div className="redirectDiv">
          <a href="/login"> <button type="button"> Log in </button> </a>
        </div>
      </Alert>
    </div>
  )
}

export default WaitAccountActivationPage
