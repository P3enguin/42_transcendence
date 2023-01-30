
import React from "react";
import  { useEffect } from 'react';

function playerHome() {
    useEffect(() => {
        document.body.style.background = 'url("/wallpaperflare1.jpg")'
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundSize = 'cover';
       
      }, []);

    return ( <div>
        <p>hi</p>
    </div>);
}

export default playerHome;