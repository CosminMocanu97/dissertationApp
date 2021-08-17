import React from 'react';
import { Alert } from "react-bootstrap"
import '../../stylesheets/common.css'

const UnauthorizedPage = () => {
    return (
        <div className="AppContainer">
            <Alert variant="danger" className="alertContainer">
                <Alert.Heading> Access denied </Alert.Heading>
                <p>
                     You are not authorized to view this page!
            </p>
                <hr />
                <div className="redirectDiv">
                    <a href="/user"> <button type="button"> Homepage </button> </a>
                </div>
            </Alert>
        </div>
    )
}

export default UnauthorizedPage
