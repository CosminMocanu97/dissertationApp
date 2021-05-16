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
        <Alert.Heading> Contul a fost creat cu succes!</Alert.Heading>
        <p>
          Vă rugăm să verificați adresa de email <span className="userEmail"> {email} </span> pentru activare.
        </p>
        <hr />
        <div className="redirectDiv">
          <a href="/login"> <button type="button"> Intră în cont </button> </a>
        </div>
      </Alert>
    </div>
  )
}

export default WaitAccountActivationPage
