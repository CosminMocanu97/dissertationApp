import React, { useState } from 'react'
import {
    TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
  }
    from '@material-ui/core'
import { axiosWrapper, config } from "../../utils/axiosWrapper"
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import '../../stylesheets/popoutForms.css'
import { verifyToken } from '../../utils/verifyToken'

function NewFolderPage(props) {
  const [folderName, setFolderName] = useState("")
  const [folderNameError, setFolderNameError] = useState("")

  //function that updates the state as the user types in the input
  const handleChange = (event) => {
    const { name, value } = event.target
    switch (name) {
      case 'folderName': 
        setFolderName(value)
        if(value === "") {
          setFolderNameError("Folder name cannot be empty")
        } 
        else {
          setFolderNameError("")
        }
        break

      default:
        break
    }
  }

  //function that updates the state as the user types in the input
  const handleSubmit = (event) => {
    event.preventDefault()
    if (folderName === "") {
      setFolderNameError("This field cannot be empty")
    }
    else {
      const data = { 
        folderName: folderName
      }
      axiosWrapper.post("/new_folder", data, config)
        .then(result => {
          window.location = "/user"
        })
        .catch(error => {
          if (error.response.data.error === "jwtExpired") {
            verifyToken("/user")
          }
          else if (error.response.status === 409) {
            setFolderNameError("There's already a folder with this name")
          }
          else if (error.response.status === 403) {
            setFolderNameError("Folder name cannot be empty")
          }
          else {
            window.location = "/error"
          }
        })
    }
  }

  return (
    <Dialog open={true} className="popoutContainer">
      <DialogTitle>Create workspace</DialogTitle>
      <DialogContent>

        <TextField helperText={folderNameError} error={(folderNameError === "") ? false : true}
          value={folderName} onChange={handleChange} margin="dense" variant="outlined" label="Name" name="folderName" autoFocus  />

      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" startIcon={<CloseIcon/>} onClick={props.closePopout}> Close </Button>
        <Button variant="contained" color="primary" startIcon={<AddIcon/>} onClick={handleSubmit}> Add </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewFolderPage
