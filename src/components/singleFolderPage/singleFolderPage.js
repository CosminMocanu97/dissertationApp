import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import { axiosWrapper, config } from '../../utils/axiosWrapper'
import Navbar from '../../utils/navbar'
import "../../stylesheets/loggeduser.css"
import { verifyToken } from '../../utils/verifyToken'
import CircularProgress from '@material-ui/core/CircularProgress'

function LoggedUserPage(props) {
  const { folder_id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [rootFolder, setRootFolder] = useState("")
  const [ownerID, setOwnerID] = useState(null)
  const [allSubfoldersArray, setAllSubfoldersArray] = useState(null)

  useEffect(() => {
    axiosWrapper.get('/user/' + folder_id, config) 
    .then(response => {
        const result = response.data.subfolders
        setAllSubfoldersArray(result)
        setRootFolder(response.data.rootfolder)
        setOwnerID(response.data.ownerID)
        setIsLoading(false)
    }).catch(err => {
        if (err.response.data.error === "jwtExpired") {
          verifyToken('/user/' + folder_id)
        }
        window.location = "/user"
    })
  }, [folder_id]);

  if (!localStorage.getItem("session_active") || localStorage.getItem("session_active") === null) {
    window.location = "/login"
    return (
      <div className = "circularProgress">
          <CircularProgress />
      </div>
    )
  } else if(!isLoading && allSubfoldersArray !== null && allSubfoldersArray.length > 0) {
    return (
    <div className="appContainer">
      <Navbar ownerID = {ownerID}/>
        <h1 className="sectionTitle"> Existing folders in workspace <span> {rootFolder}</span>: </h1>
        <div className="folderDetails">
            {allSubfoldersArray.map(subfolder => (
              <div key = {subfolder.ID} className="singleFolderDiv">
                  <Button
                  disableRipple={true}
                  variant="outlined"
                  color="default"              
                  startIcon={<FolderSharedIcon />}
                  href={"/user/" + folder_id + "/" + subfolder.ID}
                  >
                  <span className="folderName"> {subfolder.Name}  </span>
                  </Button>
              </div>
            ))}
      </div>
    </div>
    )
  }
    return (
    <div className="appContainer">
      <Navbar ownerID = {ownerID}/>
        <h1 className="sectionTitle"> The workspace <span> {rootFolder} </span> has no folders.</h1>
        <div className="folderDetails">
  
      </div>
    </div>
    )
}

export default LoggedUserPage
