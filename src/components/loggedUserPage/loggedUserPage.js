import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import FolderIcon from '@material-ui/icons/Folder'
import { axiosWrapper, config } from '../../utils/axiosWrapper'
import Navbar from '../../utils/navbar'
import "../../stylesheets/loggeduser.css"
import { verifyToken } from '../../utils/verifyToken'
import CircularProgress from '@material-ui/core/CircularProgress'

function LoggedUserPage(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [allFoldersArray, setAllFoldersArray] = useState(null)

  useEffect(() => {
    axiosWrapper.get('/user', config) 
    .then(response => {
        const result = response.data.folders
        setAllFoldersArray(result)
        setIsLoading(false)
    }).catch(err => {
        if (err.response.data.error === "jwtExpired") {
          verifyToken("/user")
        }
        window.location = "/error"
    })
  }, []);

  if (!localStorage.getItem("session_active") || localStorage.getItem("session_active") === null) {
    window.location = "/login"
    return (
      <div className = "circularProgress">
          <CircularProgress />
      </div>
    )
  } else if(!isLoading && allFoldersArray !== null && allFoldersArray.length > 0) {
    return (
    <div className="appContainer">
      <Navbar />
        <h1 className="sectionTitle"> The current workspaces are: </h1>
        <div className="folderDetails">
            {allFoldersArray.map(folder => (
              <div key = {folder.ID} className="singleFolderDiv">
                  <Button
                  disableRipple={true}
                  variant="outlined"
                  color="default"              
                  startIcon={<FolderIcon />}
                  href={"/user/" + folder.ID}
                  >
                  <span className="folderName"> {folder.Name}  </span>
                  </Button>
              </div>
            ))}
      </div>
    </div>
    )
  }
    return (
    <div className="appContainer">
      <Navbar />
        <h1 className="sectionTitle"> No workspaces found.</h1>
        <div className="folderDetails">

      </div>
    </div>
    )
}

export default LoggedUserPage
