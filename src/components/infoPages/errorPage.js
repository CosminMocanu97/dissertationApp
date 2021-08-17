import React from 'react';
import { Alert } from "react-bootstrap"
import '../../stylesheets/common.css'

const ErrorPage = () => {

    return (
        <div className="AppContainerInfo">
            <Alert variant="danger" className="alertContainer">
                <Alert.Heading> Error </Alert.Heading>
                <p>
                    There was an error while trying to access this page, please try again!
            </p>
                <hr />
                <div className="redirectDiv">
                    <a href="/user"> <button type="button"> Homepage </button> </a>
                </div>
            </Alert>
        </div>
    )
}

export default ErrorPage
