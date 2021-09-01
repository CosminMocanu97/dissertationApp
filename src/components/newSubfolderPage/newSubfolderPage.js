import React, { useState } from 'react'
import {
    TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
  }
    from '@material-ui/core'
import { axiosWrapper, config } from "../../utils/axiosWrapper"
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import '../../stylesheets/popoutForms.css'
import { useParams } from 'react-router-dom'
import { verifyToken } from '../../utils/verifyToken'

function NewSubfolderPage(props) {
  const { folder_id } = useParams()
  const [subfolderName, setSubfolderName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [subfolderNameError, setSubfolderNameError] = useState("")

  //function that updates the state as the user types in the input
  const handleChange = (event) => {
    const { name, value } = event.target
    switch (name) {
      case 'subfolderName': 
        setSubfolderName(value)
        if(value === "") {
          setSubfolderNameError("Folder name cannot be empty")
        } 
        else {
          setSubfolderNameError("")
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
    if (subfolderName === "") {
      setSubfolderNameError("This field cannot be empty")
    }
    else {
      const data = { 
        subfolderName: subfolderName,
        password : password
      }
      axiosWrapper.post("/user/" + folder_id + "/new_subfolder", data, config)
        .then(result => {
          window.location = "/user/" + folder_id
        })
        .catch(error => {
          if (error.response.data.error === "jwtExpired") {
            verifyToken("/user/" + folder_id)
          }
          else if (error.response.status === 409) {
            setSubfolderNameError("There's already a folder with this name")
          }
          else if (error.response.status === 403) {
            setSubfolderNameError("Folder name cannot be empty")
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

        <TextField helperText={subfolderNameError} error={(subfolderNameError === "") ? false : true}
          value={subfolderName} onChange={handleChange} margin="dense" variant="outlined" label="Name" name="subfolderName" autoFocus  />

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

export default NewSubfolderPage
