import React from 'react';
import { Alert } from "react-bootstrap"
import '../../stylesheets/404page.css'
import '../../stylesheets/common.css'

function PasswordChangeSuccess() {

    return (
    <div className="AppContainerInfo">
        <Alert variant="success" className="alertContainer">
            <Alert.Heading> Success </Alert.Heading>
            <p>
                The password was successfully changed! You can now log in!
            </p>
            <hr />
            <div className="redirectDiv">
                <a href="/login"> <button type="button"> Log in </button> </a>
            </div>
        </Alert>
    </div>
    )
}

export default PasswordChangeSuccess
