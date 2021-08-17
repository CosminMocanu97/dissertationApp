import React, { useState } from 'react'
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
  }
    from '@material-ui/core'
import { axiosWrapper, config } from "../../utils/axiosWrapper"
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText'
import { useParams } from 'react-router-dom'
import '../../stylesheets/popoutForms.css'

function NewFilePage(props) {
  const { folder_id } = useParams()
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileError, setSelectedFileError] = useState("")

  //function that updates the state as the user types in the input
  const handleSubmit = (event) => {
    event.preventDefault()
    if (selectedFile === null) {
        setSelectedFileError("Please select a file before uploading")
    }
    else {
      if (folder_id !== undefined) {
        const formData = new FormData()
        formData.append(
            'file',
            selectedFile,
            selectedFile.name
        )
        axiosWrapper.post("/user/" + folder_id + "/upload", formData, config)
            .then(response => {
            window.location = "/user/" + folder_id
            })
            .catch(error => {
            if (error.response.status === 409) {
                setSelectedFileError("The file already exists in the folder")
            }
            else if (error.response.status === 403) {
                setSelectedFileError("The extension must be .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx")
            }
            else {
                window.location = "/error"
            }
            })
        } else {
            alert("Couldn't receive the folder id")
        }
    }
  }

  return (
    <Dialog open={true} className="popoutContainer">
      <DialogTitle>Add new file</DialogTitle>
      <DialogContentText>
        Please select the file you want to upload:
        </DialogContentText>
      <DialogContent>

     <FormControl variant="outlined">
        <input className="uploadFile" type="file" name="file" onChange={(event) => setSelectedFile(event.target.files[0])}/> 
        <FormHelperText error={true} > {selectedFileError} </FormHelperText>
     </FormControl>

      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" startIcon={<CloseIcon/>} onClick={props.closePopout} > Close </Button>
        <Button variant="contained" color="primary" startIcon={<AddIcon/>} onClick={handleSubmit}> Add </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewFilePage
