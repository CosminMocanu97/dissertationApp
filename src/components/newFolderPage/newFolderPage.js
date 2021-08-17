import React, { useState } from 'react'
import {
    TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
  }
    from '@material-ui/core'
import { axiosWrapper, config } from "../../utils/axiosWrapper"
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import '../../stylesheets/popoutForms.css'

import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

function NewFolderPage(props) {
  const [folderName, setFolderName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [folderNameError, setFolderNameError] = useState("")

  //function that updates the state as the user types in the input
  const handleChange = (event) => {
    const { name, value } = event.target
    switch (name) {
      case 'folderName': 
        setFolderName(value.trim())
        if(value === "") {
          setFolderNameError("Folder name cannot be empty")
        } 
        else {
          setFolderNameError("")
        }
        break

      case 'password':
         setPassword(value) 
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
        folderName: folderName,
        password : password
      }
      axiosWrapper.post("/new_folder", data, config)
        .then(result => {
          window.location = "/user"
        })
        .catch(error => {
          if (error.response.status === 409) {
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
      <DialogTitle>Create a new folder</DialogTitle>
      <DialogContentText>
        Please type the folder name:
        </DialogContentText>
      <DialogContent>

        <TextField helperText={folderNameError} error={(folderNameError === "") ? false : true}
          value={folderName} onChange={handleChange} margin="dense" variant="outlined" label="Name" name="folderName" autoFocus  />

        <FormControl variant="outlined" margin="dense">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            name="password"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick= {() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
            <FormHelperText error={false} > In case you don't want to set a password, leave this field empty </FormHelperText>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" startIcon={<CloseIcon/>} onClick={props.closePopout}> Close </Button>
        <Button variant="contained" color="primary" startIcon={<AddIcon/>} onClick={handleSubmit}> Add </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewFolderPage
