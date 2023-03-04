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

function loginPage({ session42 }: { session42: string }) {
      console.log(session42);
      return (
        <div className="grid h-screen place-items-center items-start ">
            <UpdateProfile session42={session42}/>
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

    // const session = await getServerSession(context.req, context.res, authOption)
    // if (!session) {
    //     return {
    //       redirect: {
    //         destination: '/',
    //         permanent: false,
    //       },
    //     }
    //   }
    // const email =session?.user?.email;
    // const resp = await fetch("http://localhost:8000/auth/user?email="
    //         + email);
    // const res = await resp.json();
    // console.log(res);
    // if (res.nickname)
    // // here I should create a jwt token, I guess 
    // return {
    //     redirect : {
    //         destination: '/user',
    //         permanent:true,
    //     }
    // }
    return {
      props: {  
        session42: session42,
      },
    };
}

export default loginPage;