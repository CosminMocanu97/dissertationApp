import React, { useCallback, useState } from 'react'
import {
    FormControl, FormHelperText, InputAdornment, InputLabel, Button, OutlinedInput, Dialog, IconButton, DialogActions, DialogContent, 
    DialogContentText, DialogTitle }
    from '@material-ui/core'
import { axiosWrapper, config } from "../../utils/axiosWrapper"
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import CloseIcon from '@material-ui/icons/Close'
import LockIcon from '@material-ui/icons/Lock'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import '../../stylesheets/popoutForms.css'
import { useParams } from 'react-router'
import { verifyToken } from '../../utils/verifyToken'

function NewFolderPage({ isLocked, setIsLocked }) {
  const { folder_id } = useParams()
  const { subfolder_id } = useParams()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState()

  //function that updates the state as the user types in the input
  const handleChange = (event) => {
    const { name, value } = event.target
    switch (name) {
      case 'password': 
        setPassword(value) 
        if(value === "") {
            setPasswordError("Please fill in the password")
        } 
        else {
            setPasswordError("")
        }
        break

      default:
        break
    }
  }

  //function that updates the state as the user types in the input
  const handleSubmit = useCallback(event => {
    event.preventDefault()
    if (password === "") {
        setPasswordError("Please fill in the password")
    } else {
      const data = { 
        password : password
      }
      axiosWrapper.post("/user/" + folder_id + "/" + subfolder_id, data, config)
        .then(result => {
          sessionStorage.setItem("folder" + folder_id, false)
          setIsLocked(false)
        })
        .catch(error => {
          if (error.response.data.error === "jwtExpired") {
            verifyToken("/user/" + folder_id + "/" + subfolder_id)
          }
          if (error.response.status === 401) {
            setPasswordError('The provided password is incorrect')
          } else {
            window.location = "/error"
          }
        })
    }
    
  }, [setIsLocked, password, folder_id, subfolder_id])

  return (
    <Dialog open={true} className="popoutContainer">
      <DialogTitle> <LockIcon className = "lockImg" /> <span> Password required </span>  </DialogTitle>
      <DialogContentText>
        Please type the password in order to access this folder:
        </DialogContentText>
      <DialogContent>

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
            <FormHelperText error={true} > {passwordError} </FormHelperText>
        </FormControl>
        
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" startIcon={<CloseIcon/>} onClick={() => window.location = "/user/" + folder_id}> Close </Button>
        <Button variant="contained" color="primary" startIcon={<VerifiedUserIcon/>} onClick={handleSubmit}> Verify </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewFolderPage
