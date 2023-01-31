import React from "react";
import  { useEffect } from 'react';
import ProfileInfo from "@/components/ProfileInfo";


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

    return ( <div className="profile-page" >
            <ProfileInfo/>
    </div>);
}

export default playerProfile;