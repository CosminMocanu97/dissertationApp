import React from 'react'
import "../../stylesheets/loggeduser.css"
import Navbar from '../../utils/navbar'

function LoggedUserPage() {
    return (
    <div className="deviceContainer">
        <Navbar />
        <div className="details">
          <div className="deviceDetails">
            <h1 className="sectionTitle"> Folders </h1>
            {/* show the informations regarding device details on render */}
                 <button> save </button>

        </div>
      </div>
    </div>
    )
}

export default LoggedUserPage
