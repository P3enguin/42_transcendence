import { getSession, useSession } from "next-auth/react";
import Router from 'next/router';
import axios from "axios";
import { useEffect } from "react";
import { getServerSession } from "next-auth/next"
import { authOption } from '../pages/api/auth/[...nextauth]'
import UpdateProfile from "@/components/profile/UpdateProfileComp";
import { cookies } from 'next/headers';
import { Props } from "@headlessui/react/dist/types";

// function isBetween(length:number, min:number, max:number) :boolean {
//     if (length >= min && length <= max)
//       return true;
//     return false
// }

// async function handleSubmit(event:any,email:string) {
//     event.preventDefault();

//     const nickname = event.target.nickname.value;
//     const nicknameInput = document.getElementById("nickname");
//     const err = document.getElementsByClassName("error");
  
//     err[0].innerHTML="";
//     if (!nickname || nickname.trim() === "")
//     {
//       err[0].innerHTML="Nickname should not be empty!";
//       nicknameInput!.classList.add("err");
//     }
//     else if (!isBetween(nickname.length,6,20))
//     {
//       err[0].innerHTML="Nickname must be 6-25 character long!";
//       nicknameInput!.classList.add("err");
//     }
//     else {
//       const data = {
//           nickname: nickname,
//           email: email,
//           // picture: event.target.picture.value,
//       }
//       const url:string = 'http://localhost:8000/auth/user'
//       const options = {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data),
//       }    
//       const response = await fetch(url, options);
//       const result = await response.json();
//       console.log(result);
  
//       if (!result.nickname)
//       {
//         err[0].innerHTML="Nickname already in use";
//         nicknameInput!.classList.add("err");
//         return;
//       }
//       if (result.nickname)
//       {
//         nicknameInput!.classList.add("success");
//         err[0].innerHTML="";
//         Router.push('/profile');
//       }
//     }

// }

function loginPage({session42,email,fullname,image }: 
          { session42: string,email:string,fullname:string,image:string }) {

      return (
        <div className="grid h-screen place-items-center items-start ">
            <UpdateProfile session42={session42} email={email} fullname={fullname}  image={image}/>
        </div>

      )
    // const {data: session,status} = useSession();

    // if (status ==="authenticated")
    // {
        // return (<div className="registration-container">
        //             <form className="login-form"onSubmit={(event)=>handleSubmit(event,session.user?.email!)}>
        //                 <div className="login-page-element-container nick" id="nick">
        //                   <InputLabels _id="nickname" _labelValue="Enter a nickname" disabled={false} />
        //                   <div className="error"></div>
        //                 </div>
        //                 <div className="login-page-element-container pic">
        //                   <InputLabels _id="picture" _labelValue="Enter a picture" disabled={false} _type="file" />
        //                   <small></small>
        //                 </div>
        //                 <button className="login-submit-button" type="submit">Submit</button>
        //             </form>
        //         </div>
        //     );
    // }
}

export async function getServerSideProps(context:any) {


  const session42 : string  = context.req.cookies["42access_token"];
  if (!session42)
  {
    return {
      redirect : {
        destination : '/',
        permanent : true,
      }
    }
  }
  console.log(session42);
  const resp = await fetch("https://api.intra.42.fr/v2/me",
          { headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${session42}`, // notice the Bearer before your token
        }})
      
  const data = await resp.json().catch((error) => {return {
        error : "Error occured while fetching data",
  }});

    return {
      props: {  
        session42: session42,
        email:data.email as string,
        fullname:data.displayname as string,
        image:data.image.link as string
      },
    };
}

export default loginPage;