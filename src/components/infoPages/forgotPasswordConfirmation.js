import React from 'react'
import { Alert } from "react-bootstrap"
import '../../stylesheets/confirmationPage.css'
import '../../stylesheets/common.css'

function PasswordConfirmation() {
    
    return (
        <div className="AppContainerInfo">
            <Alert variant="success" show={true} className="AppConfirmation">
                <Alert.Heading> Your request has been sent </Alert.Heading>
                <p>
                    If the provided address is correct, you'll receive an email soon.
                </p>
                <hr />
                <p className="mb-0">
                     If you haven't received any email after 5 minutes or more, please check the Spam folder.
                </p>
                <a href="/login"> <button type="button" className="btn-primary form-control"> Log in  </button> </a>
            </Alert>
        </div>
    )
}
export default PasswordConfirmation
