import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import "../../stylesheets/loggeduser.css"
import { axiosWrapper, config } from '../../utils/axiosWrapper'
import Navbar from '../../utils/navbar'
import DescriptionIcon from '@material-ui/icons/Description'
import PdfImg from '../../icons/pdf.png'
import DocImg from '../../icons/word.png'
import XlsImg from '../../icons/xlsx.png'
import PptImg from '../../icons/ppt.png'
import Icon from "@material-ui/core/Icon"
import CheckPasswordPopout from '../singleSubfolderPage/checkPasswordPopout'
import '../../stylesheets/singleFolderPage.css'
import { verifyToken } from '../../utils/verifyToken'
import CircularProgress from '@material-ui/core/CircularProgress'

function LoggedUserPage() {
  let svgIcon = null
  const { folder_id } = useParams()
  const { subfolder_id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [allFilesArray, setAllFilesArray] = useState([])
  const [currentFolder, setCurrentFolder] = useState("")
  const [workspace, setWorkspace] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [ownerID, setOwnerID] = useState(null)
  const currentUserID = Number(localStorage.getItem("user_id"))

  useEffect(() => {
    axiosWrapper.get('/user/' + folder_id + "/" + subfolder_id, config) 
    .then(response => {
        const result = response.data.files
        if (sessionStorage.getItem("folder" + folder_id) === null) {
          setIsLocked(response.data.isLocked)
          setAllFilesArray(result)
          setWorkspace(response.data.workspace)
          setCurrentFolder(response.data.currentFolder)
          setOwnerID(response.data.ownerID)
          setIsLoading(false)
        } else {
          setAllFilesArray(result)
          setCurrentFolder(response.data.currentFolder)
          setWorkspace(response.data.workspace)
          setIsLocked(sessionStorage.getItem("folder" + folder_id))
          setOwnerID(response.data.ownerID)
          setIsLoading(false)
        }  
    }).catch(error => {
      if (error.response.data.error === "jwtExpired") {
        verifyToken('/user/' + folder_id + "/" + subfolder_id)
      }
      else if (error.response.status === 400) {
        window.location = "/user"
      } else {
        alert("There was an error with the get request")
        window.location = "/error"
      }
    })
  }, [folder_id, subfolder_id]);
  
  function checkExtension(filename) {
        let extension = filename.split('.').pop()
        if(extension === "pdf") {
            svgIcon = (
              <Icon>
                <img alt="pdfImg" className="fileExtensionImg" src={PdfImg} />
              </Icon>
            )
            return svgIcon
        } 
        else if(extension === "doc" || extension === "docx") {
          svgIcon = (
            <Icon>
              <img alt="pdfImg" className="fileExtensionImg" src={DocImg} />
            </Icon>
          )
          return svgIcon
        } 
        else if (extension === "xls" || extension === "xlsx") {
          svgIcon = (
            <Icon>
              <img alt="pdfImg" className="fileExtensionImg" src={XlsImg} />
            </Icon>
          )
          return svgIcon
        } 
        else if (extension === "ppt" || extension === "pptx") {
          svgIcon = (
            <Icon>
              <img alt="pdfImg" className="fileExtensionImg" src={PptImg} />
            </Icon>
          )
          return svgIcon
        }
        else {
          <DescriptionIcon />
        }
  }

  if (!localStorage.getItem("session_active") || localStorage.getItem("session_active") === null) {
    window.location = "/login"
    return (
      <div className = "circularProgress">
          <CircularProgress />
      </div>
    )
  }

  if(!isLoading && allFilesArray !== null && allFilesArray.length > 0) {
    if(isLocked === true && ownerID !== currentUserID) {
      return (
        <div className="fileContainer">
           <Navbar ownerID = {ownerID} />
          <CheckPasswordPopout isLocked = {isLocked} setIsLocked = {setIsLocked} />
        </div>
      )
    } 
      return (
      <div className="fileContainer">
        <Navbar ownerID = {ownerID} />
        <h1 className="sectionTitle"> Office files in<span> {workspace} / {currentFolder}</span>: </h1>
          <div className="fileList">
            {allFilesArray.map(file =>  {
                  if(file.Name.split('.').pop() !== "pdf") {
                      return <div className="fileLinkDiv" key={file.ID}>
                                {checkExtension(file.Name)}
                                <a href={"/user/" + folder_id + "/" + subfolder_id + "/" + file.ID}> 
                                {file.Name}
                                </a> 
                            </div>
                  }
                  return ""
              })}
        </div>

        <h1 className="sectionTitlePDF"> PDF files in <span> {workspace} / {currentFolder}</span>: </h1>
        <div className="fileList">
            {allFilesArray.map(file =>  {
                if(file.Name.split('.').pop() === "pdf") {
                    return <div className="fileLinkDiv" key={file.ID}>
                              {checkExtension(file.Name)}
                              <a href={"/user/" + folder_id + "/" + subfolder_id + "/" + file.ID}> 
                              {file.Name}
                              </a> 
                          </div>
                }
                return ""
            })}

        </div>
      </div>
    )
}
  else {
    if(isLocked === true && ownerID !== currentUserID) {
      return (
        <div className="fileContainer">
          <Navbar ownerID = {ownerID} />
          <CheckPasswordPopout isLocked = {isLocked} setIsLocked = {setIsLocked} />
        </div>
      )
    } 
    return (
      <div className="fileContainer">
        <Navbar ownerID = {ownerID} />
        {currentFolder !== "" ?  <h1 className="sectionTitle"> No files in<span> {workspace} / {currentFolder}</span>: </h1> :  ""}
      </div>
    )
  }
}

export default LoggedUserPage
