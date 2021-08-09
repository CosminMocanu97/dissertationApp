import React, { useRef, useEffect } from 'react';
import WebViewer, { Core } from '@pdftron/webviewer';
import axios from "axios"
import '../stylesheets/fileModification.css'
import { string } from 'prop-types'

function FileModificationPage() {
  const viewer = useRef(null);
  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/sample.pdf',
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
              
              const header = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json' } 

              console.log(arr)

              const dataToSent = {
                filename : "testing.pdf",
                blobObj : new TextDecoder().decode(arr)
              }

              //console.log(new TextDecoder().decode(arr))

              axios.post('http://localhost:8080/test', blob, header)
              .then(response => 
                console.log(response)
                )
              .catch(error => {
                console.log(error)
              });
           
            }
          });
        });
      const { documentViewer, annotationManager, Annotations } = instance.Core;


    });
  }, []);


  return (
    <div className="FileModification">
      <div className="header">React sample
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default FileModificationPage;
