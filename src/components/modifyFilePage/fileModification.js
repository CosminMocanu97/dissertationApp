import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { useParams } from 'react-router-dom'
import { axiosWrapper, config } from '../../utils/axiosWrapper'
import "../../stylesheets/fileModification.css"
import Navbar from '../../utils/navbar'

function FileModificationPage() {
  const viewer = useRef(null);
  const { folder_id } = useParams()
  const { file_id } = useParams()
  const [fileDetails, setFileDetails] = useState(null)
  const [ownerID, setOwnerID] = useState(null)

  useEffect(() => {
    axiosWrapper.get('/user/' + folder_id + '/' + file_id, config) 
    .then(response => {
        const result = response.data.file
        setFileDetails(result)
        setOwnerID(response.data.file.OwnerID)
    }).catch(error => {
        console.log(error)
        alert("There was an error with the get request")
    })
  }, [folder_id, file_id]);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    if(fileDetails !== null) {
      const API =  "http://localhost:8080/getFile/" + fileDetails.RootFolder + "/" + fileDetails.Filename

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
                  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

                  axiosWrapper.post('/user/' + folder_id + "/" + file_id + "/update", blob, config)
                  .then(response => 
                     window.location = "/user/" + folder_id + "/" + file_id 
                    )
                  .catch(error => {
                    console.log(error)
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
  }, [folder_id, file_id, fileDetails]);

  return (
    <div className="FileModification">
      <Navbar ownerID = {ownerID} />
      <div className="header">
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default FileModificationPage;
