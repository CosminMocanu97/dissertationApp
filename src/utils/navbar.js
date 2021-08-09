import React from 'react'
import { Navbar, Nav, NavbarBrand, NavDropdown, Button } from "react-bootstrap"
import Logo from '../logo/ismase.png'
import '../utilsStylesheet/navbar.css'

function NavigationBar() {
    const userEmail = localStorage.getItem("user_email") || "";

    // function to log out the user
    const logOut = () => {
        localStorage.removeItem("session_active")
        localStorage.removeItem("user_id")
        localStorage.removeItem("jwt")
        localStorage.removeItem("user_email")
        localStorage.removeItem("role")
        // after the fields storing the data about the loged user are cleaned, redirect to the login page
        window.location = "/login"
    }
        

    return (
        <Navbar onToggle = {() => false} collapseOnSelect expand="lg" variant="dark" 
        className="navbarContainer">
        <NavbarBrand href="/user">
        <img alt="" src={Logo} className="logoImg d-inline-block align-top" />
        </NavbarBrand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>  
    
        <Nav className="mr-auto ">
            {/* button used to show "add device" form */}
            <Button className="allButtons" href=""> Folder nou </Button>
        </Nav>

        <Nav.Item className="userDropdown" >
            <NavDropdown title={userEmail} id="loggeduserDropdown">
            <NavDropdown.Item href="#" onClick={logOut}> Log out</NavDropdown.Item>
            </NavDropdown>
        </Nav.Item>
        </Navbar.Collapse>
    
    </Navbar>
        )
}

export default NavigationBar
