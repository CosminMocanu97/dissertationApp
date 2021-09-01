import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { useParams } from 'react-router-dom'
import { axiosWrapper, config } from '../../utils/axiosWrapper'
import CheckFilePassword from './checkFilePasswordPage';
import "../../stylesheets/fileModification.css"
import Navbar from '../../utils/navbar'
import { verifyToken } from '../../utils/verifyToken'
import CircularProgress from '@material-ui/core/CircularProgress'

function FileModificationPage() {
  const viewer = useRef(null);
  const { folder_id } = useParams()
  const { subfolder_id } = useParams()
  const { file_id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [fileDetails, setFileDetails] = useState(null)
  const [isLocked, setIsLocked] = useState(false)
  const [ownerID, setOwnerID] = useState(null)
  const currentUserID = Number(localStorage.getItem("user_id"))

  useEffect(() => {
    axiosWrapper.get('/user/' + folder_id + "/" + subfolder_id + "/" + file_id, config) 
    .then(response => {
        const result = response.data.file
        if (sessionStorage.getItem("file" + file_id) === null) {
        setFileDetails(result)
        setIsLocked(result.FileLocked)
        setOwnerID(result.OwnerID)
        setIsLoading(false)
        } else {
          setFileDetails(result)
          setIsLocked(sessionStorage.getItem("file" + file_id))
          setOwnerID(result.OwnerID)
          setIsLoading(false)
        }  
      }).catch(error => {
        if (error.response.data.error === "jwtExpired") {
          verifyToken("/user/" + folder_id + "/" + subfolder_id + "/" + file_id)
        }
        alert("There was an error with the get request")
        window.location = "/error"
    })
  }, [folder_id, file_id, subfolder_id]);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    if(fileDetails !== null) {
      const API =  "http://localhost:8080/getFile/" + fileDetails.Workspace + "/" + fileDetails.CurrentFolder + "/" + fileDetails.Filename

      if(fileDetails.Filename.split('.').pop() === "pdf") {
        WebViewer(
          {
            path: '/webviewer/lib',
            initialDoc: API
          },
          viewer.current,
        ).then((instance) => {
          instance.UI.setHeaderItems(header => {
              header.push({
                type: 'actionButton',
                img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
                onClick: async () => {
                  const doc = documentViewer.getDocument();
                  const xfdfString = await annotationManager.exportAnnotations();
                  const options = { xfdfString };
                  const data = await doc.getFileData(options);
                  const arr = new Uint8Array(data);
                  const blob = new Blob([arr], { type: 'application/pdf' });

                  axiosWrapper.post('/user/' + folder_id + "/" + subfolder_id + "/" + file_id + "/update", blob, config)
                  .then(response => 
                     window.location = "/user/" + folder_id + "/" + subfolder_id + "/" + file_id 
                    )
                  .catch(error => {
                    alert("There is an error with the POST update file")
                  });
                }
              });
              const { documentViewer, annotationManager } = instance.Core;
            });
        });
      } 
      else {
        WebViewer(
          {
            path: '/webviewer/lib',
            initialDoc: API
          },
          viewer.current,
        )
      }
    }
  }, [folder_id, file_id, subfolder_id, fileDetails]);

  if (!localStorage.getItem("session_active") || localStorage.getItem("session_active") === null) {
    window.location = "/login"
    return (
      <div className = "circularProgress">
          <CircularProgress />
      </div>
    )
  }

  else if(!isLoading && fileDetails !== null && isLocked === true && ownerID !== currentUserID && localStorage.getItem("is_admin") === "false") {
    return (
      <div className="fileContainer">
         <Navbar ownerID = {ownerID} />
        <CheckFilePassword isLocked = {isLocked} setIsLocked = {setIsLocked} />
      </div>
    )
  } 
  else {
    return (
      <div className="FileModification">
        <Navbar ownerID = {ownerID} />
        <div className="header">
        </div>
        <div className="webviewer" ref={viewer}></div>
      </div>
    )
  }
}

export default FileModificationPage;
