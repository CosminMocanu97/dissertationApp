import React, { Component } from 'react'
import { Alert } from "react-bootstrap"
import '../../stylesheets/confirmationPage.css'
import '../../stylesheets/common.css'

class PasswordConfirmation extends Component {
    render() {
        return (
        <div className = "AppContainer">
            <Alert variant="success" show = {true} className = "AppConfirmation">
                <Alert.Heading> Cererea a fost trimisă </Alert.Heading>
                <p>
                Un email din partea noastra va sosi curand daca adresa specificata exista
                </p>
                <hr />
                <p className="mb-0">
                Dacă nu primiti email, vă rugam să verificați sectiunea Spam a emailului dvs
                </p>
                <a href="/login"> <button type="button" className="btn-primary form-control"> Intră în cont  </button> </a>
            </Alert>
        </div>
        )
    }
}
export default PasswordConfirmation
