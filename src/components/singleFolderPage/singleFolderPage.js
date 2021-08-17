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
import CheckPasswordPopout from '../singleFolderPage/checkPasswordPopout'
import '../../stylesheets/singleFolderPage.css'

function LoggedUserPage() {
  let svgIcon = null
  const { folder_id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [allFilesArray, setAllFilesArray] = useState([])
  const [currentFolder, setCurrentFolder] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [ownerID, setOwnerID] = useState(null)
  const currentUserID = Number(localStorage.getItem("user_id"))

  useEffect(() => {
    axiosWrapper.get('/user/' + folder_id, config) 
    .then(response => {
        const result = response.data.files
        if (sessionStorage.getItem("folder" + folder_id) === null) {
          setIsLocked(response.data.isLocked)
          setAllFilesArray(result)
          setCurrentFolder(response.data.currentFolder)
          setOwnerID(response.data.ownerID)
          setIsLoading(false)
        } else {
          setAllFilesArray(result)
          setCurrentFolder(response.data.currentFolder)
          setIsLocked(sessionStorage.getItem("folder" + folder_id))
          setOwnerID(response.data.ownerID)
          setIsLoading(false)
        }
    }).catch(error => {
        if (error.response.status === 400) {
          window.location = "/user"
        } else {
          console.log(error)
          alert("There was an error with the get request")
        }
    })
  }, [folder_id]);
  
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
        <h1 className="sectionTitle"> The office files that can be converted in PDF files <span> {currentFolder} </span>  are: </h1>
          <div className="fileList">
            {allFilesArray.map(file =>  {
                  if(file.Name.split('.').pop() !== "pdf") {
                      return <div className="fileLinkDiv" key={file.ID}>
                                {checkExtension(file.Name)}
                                <a href={"/user/" + folder_id + "/" + file.ID}> 
                                {file.Name}
                                </a> 
                            </div>
                  }
                  return ""
              })}
        </div>

        <h1 className="sectionTitlePDF"> The PDF files in folder <span> {currentFolder} </span>  are: </h1>
        <div className="fileList">
            {allFilesArray.map(file =>  {
                if(file.Name.split('.').pop() === "pdf") {
                    return <div className="fileLinkDiv" key={file.ID}>
                              {checkExtension(file.Name)}
                              <a href={"/user/" + folder_id + "/" + file.ID}> 
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
        {currentFolder !== "" ?  <h1 className="sectionTitle"> The folder <span> {currentFolder} </span> has no files.</h1> :  ""}
      </div>
    )
  }
}

export default LoggedUserPage
