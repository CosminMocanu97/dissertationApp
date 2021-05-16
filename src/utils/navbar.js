import React from 'react'
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import '../utilsStylesheet/navbar.css'

class NavigationBar extends React.Component {
    // function to log out the user
    logOut() {
        localStorage.removeItem("session_active")
        localStorage.removeItem("user_id")
        localStorage.removeItem("jwt")
        localStorage.removeItem("user_email")
        // after the fields storing the data about the loged user are cleaned, redirect to the login page
        window.location = "/login"
    }
    
    render() {
    // retrieve the email of the loged user
    const userEmail = localStorage.getItem("user_email") || "";

        return (
            <Navbar onToggle = {() => false} collapseOnSelect expand="lg" variant="dark" 
            className="navbarContainer">
            <Navbar.Collapse>  
            <Nav.Item className="userDropdown" >
                <NavDropdown title={userEmail} id="loggeduserDropdown">
                <NavDropdown.Item href="#"> Setări </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#" onClick={this.logOut}> Log out</NavDropdown.Item>
                </NavDropdown>
            </Nav.Item>
            </Navbar.Collapse>
        
        </Navbar>
         )
    }
}

export default NavigationBar
