import React from 'react';
import { Alert } from "react-bootstrap"
import '../../stylesheets/404page.css'
import '../../stylesheets/common.css'

const InexistentPage = () => {
    return (
        <div className="AppContainer">
            <Alert variant="danger" className="App404Page">
                <Alert.Heading> 404 </Alert.Heading>
                <p>
                    Pagina solicitată nu există!
            </p>
                <hr />
                <div className="redirectDiv">
                    <a href="/login"> <button type="button"> Intră în cont </button> </a>
                </div>
            </Alert>
        </div>
    )
}

export default InexistentPage
