import React from 'react'
import { Alert } from "react-bootstrap"
import '../../stylesheets/404page.css'
import '../../stylesheets/common.css'

function InexistentPage() {
    
    return (
        <div className="AppContainerInfo">
            <Alert variant="danger" className="App404Page">
                <Alert.Heading> 404 page not found </Alert.Heading>
                <p>
                    The requested page doesn't exist!
                </p>
                <hr />
                <div className="redirectDiv">
                    <a href="/user"> <button type="button"> Homepage </button> </a>
                </div>
            </Alert>
        </div>
    )
}

export default InexistentPage
