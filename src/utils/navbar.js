import React, { useState } from 'react'
import { Navbar, Nav, NavbarBrand, NavDropdown } from "react-bootstrap"
import { axiosWrapper, config } from './axiosWrapper'
import Button from '@material-ui/core/Button'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import Logo from '../icons/ismase.png'
import LogoutImg from '../icons/logout.png'
import { useParams } from 'react-router-dom'
import NewFolderPage from '../components/newFolderPage/newFolderPage'
import NewFilePage from '../components/newFilePage/newFilePage'
import DeleteIcon from '@material-ui/icons/Delete';
import '../utilsStylesheet/navbar.css'

function NavigationBar(props) {
    const {folder_id} = useParams()
    const {file_id} = useParams()
    const userEmail = localStorage.getItem("user_email") || ""
    const [newFolderPopout, setNewFolderPopout] = useState(false)
    const [newFilePopout, setNewFilePopout] = useState(false)
    const currentUserID = Number(localStorage.getItem("user_id"))

    const openNewFolderPopout = () => {
        setNewFolderPopout(true)
    }
    const closeNewFolderPopout = () => {
        setNewFolderPopout(false)
    }
    const openNewFilePopout = () => {
        setNewFilePopout(true)
    }
    const closeNewFilePopout = () => {
        setNewFilePopout(false)
    }

    // function to log out the user
    const logOut = () => {
        localStorage.removeItem("session_active")
        localStorage.removeItem("user_id")
        localStorage.setItem("jwt", "")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_email")
        // after the fields storing the data about the loged user are cleaned, redirect to the login page
        window.location = "/login"
    }

    const deleteFolder = (folderID) => {
        axiosWrapper.delete("/user/" + folderID + "/remove_folder",  config)
        .then(
            window.location = "/user"
        )
        .catch(error => {
            console.log(error.response.data)
            alert("Error while deleting folder")
        })
    }

    const deleteFile = (folderID, fileID) => {
        axiosWrapper.delete("/user/" + folderID + "/" + fileID + "/remove_file",  config)
        .then(
            window.location = "/user/" + folderID
        )
        .catch(error => {
            console.log(error.response.data)
            alert("Error while deleting the file")
        })
    }

    function navbarElements(path) {
        if(folder_id !== undefined) {
            if(path === "/user/" + folder_id) {
                return  <Nav className="mr-auto ">
                            <Button className="allButtons" variant="contained" color="primary" onClick={openNewFilePopout}>
                                <NoteAddIcon className="btnSvg" /> Add file
                            </Button>
                            {newFilePopout ? <NewFilePage closePopout={closeNewFilePopout}/> : ""}

                            <Button className="allButtons" variant="contained" color="primary" onClick={() => deleteFolder(folder_id)}
                            hidden = { currentUserID !== props.ownerID ? true : false} >
                                <DeleteIcon className="btnSvg" /> Delete folder
                            </Button> 
                            
                        </Nav>
            }
            else 
                return  <Nav className="mr-auto ">
                            <Button className="allButtons" variant="contained" color="primary" onClick={() => deleteFile(folder_id, file_id)}
                            hidden = { currentUserID !== props.ownerID ? true : false} >
                                <DeleteIcon className="btnSvg" /> Delete file
                            </Button>

                            {newFolderPopout ? <NewFolderPage closePopout={closeNewFolderPopout}/> : ""}
                        </Nav>
            }
        return  <Nav className="mr-auto ">
                    <Button className="allButtons" variant="contained" color="primary" onClick={openNewFolderPopout}>
                        <CreateNewFolderIcon className="btnSvg" /> New folder
                    </Button>
                    {newFolderPopout ? <NewFolderPage closePopout={closeNewFolderPopout}/> : ""}
                </Nav>
    }
        
    return (
        <Navbar onToggle = {() => false} collapseOnSelect expand="lg" variant="dark" 
        className="navbarContainer">
        <NavbarBrand href="/user">
        <img alt="" src={Logo} className="logoImg d-inline-block align-top" />
        </NavbarBrand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>  

        {navbarElements(window.location.pathname)}
    
        <Nav.Item className="userDropdown" >
            <NavDropdown title={userEmail} id="loggeduserDropdown">
            <NavDropdown.Item href="#" onClick={logOut}><img alt="exit" src={LogoutImg} /> Log out</NavDropdown.Item>
            </NavDropdown>
        </Nav.Item>
        </Navbar.Collapse>
    
    </Navbar>
    )
}

export default NavigationBar
