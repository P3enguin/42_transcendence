
import React from "react";
import  { useEffect } from 'react';

function playerProfile() {
    /* changing the background, This one should be a 
    variable and get updated aftet the user logs in  */
    useEffect(() => {
        document.body.style.background = 'url("/wallpaperflare1.jpg")'
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundSize = 'cover';
       
      });

    return ( <div className="home-page">

        <div className="profile settings">

        </div>
    </div>);
}

export default playerProfile;