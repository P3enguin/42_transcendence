import React from "react";
import  { useEffect } from 'react';
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileFriend from "@/components/profile/ProfileFriends";
import { getServerSession } from "next-auth/next"
import { authOption
 } from "./api/auth/[...nextauth]";
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
            <ProfileFriend/>
    </div>);
}


export async function getServerSideProps(context:any) {

  const session = await getServerSession(context.req, context.res, authOption)
  if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  const email =session?.user?.email;
  const resp = await fetch("http://localhost:8000/auth/user?email="
          + email);
  const res = await resp.json();
  console.log(res);
  if (!res.nickname)
  return {
      redirect : {
          destination: '/login',
          permanent:true,
      }
  }
  return {
    props: {  
      emailExists: true
    },
  };
}

export default playerProfile;