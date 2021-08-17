import React from 'react'
import { Alert } from "react-bootstrap"
import '../../stylesheets/404page.css'
import '../../stylesheets/common.css'

function InvalidLink() {

    return (
       <div className="AppContainerInfo">
            <Alert variant="danger" className="alertContainer">
                <Alert.Heading> Invalid token </Alert.Heading>
                <p>
                    The link is invalid, please try to reset your password again!
                </p>
                <hr />
                <div className="redirectDiv">
                <a href="/forgot-password"> <button type="button"> Reset password </button> </a>
            </div>
            </Alert>
        </div>
    )
}

export default InvalidLink
