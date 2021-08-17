import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';
import { axiosWrapper } from "../../utils/axiosWrapper"
import { Alert } from "react-bootstrap"
import '../../stylesheets/common.css'

const ActivateAccount = (props) => {
    // retrieve the token from the URL
    const { token } = useParams();

    // hook to set state of the validity of the token;
    // tokenStatus is 0 before the request to check if the token is correct, -1 if the token is wrong and 1 if token is correct
    const [tokenStatus, setToken] = useState(0);
    const willMount = useRef(true);

    useEffect(() => {
        if (willMount.current) {
            if (tokenStatus !== 1) {
                axiosWrapper.get('/activate/' + token)
                    .then(res => {
                        setToken(1);
                    })
                    .catch(function (error) {
                        setToken(-1);
                    })
            }
        }
            willMount.current = false;
      }, [token, tokenStatus])

    // if the account activated successfully display success to the user, otherwise tell them that the token was wrong
    if (tokenStatus === 0) {
        return <div className="loadingDiv"> <CircularProgress /> </div>
    }
    else if (tokenStatus === 1) {
        return (
            <div className="AppContainer">
                <Alert variant="success" className="alertContainer">
                    <Alert.Heading> Success </Alert.Heading>
                    <p>
                        The account was successfully activated, you can now log in!
                    </p>
                    <hr />
                    <div className="redirectDiv">
                        <a href="/login"> <button type="button"> Log in </button> </a>
                    </div>
                </Alert>
            </div>
        )
    }
    else {
        return (
            <div className="AppContainer">
                <Alert variant="danger" className="alertContainer">
                    <Alert.Heading> Invalid token </Alert.Heading>
                    <p>
                        The activation link is invalid or it expired, the account was not activated!
                    </p>
                    <hr />
                    <div className="redirectDiv">
                        <a href="/register"> <button type="button"> Înregistrare </button> </a>
                    </div>
                </Alert>
            </div>
        )
    }

}

export default ActivateAccount
