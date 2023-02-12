import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import InputLabels from "@/components/profile/InputLabels";
import axios from "axios";
import { useEffect } from "react";
import { getServerSession } from "next-auth/next"
import { authOption } from '../pages/api/auth/[...nextauth]'


async function handleSubmit(event:any,email:string | null | undefined) {
    event.preventDefault();

    const data = {
        nickname: event.target.nickname.value,
        email: email,
        // picture: event.target.picture.value,
    }
    const url:string = 'http://localhost:8000/auth/user'
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }    
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
}

function loginPage(props:any) {
    
    const {data: session,status} = useSession();
    const rout = useRouter();

    if (status === "unauthenticated")
        rout.push("/");
    else if (status ==="authenticated")
    {
        // const {data: session,status} = useSession();
        // const fetchData = async () => {
        //     const email : string |null = session.user?.email;
        //     const url:string = 'http://localhost:8000/auth/user?'
        // const resp = await fetch(url + new URLSearchParams({
        //     email: "ybensell@student.1337.ma",
        // }));
        // console.log(resp);
        // const res = await resp.json();
        // console.log(res);
        // console.log(`props value ${props.emailExists}`)
        return (<div className="registration-container">
                    <form onSubmit={(event)=>handleSubmit(event,session.user?.email)}>
                        <InputLabels _id="nickname" _labelValue="Enter a nickname" disabled={false} />
                        <InputLabels _id="picture" _labelValue="Enter a picture" disabled={false} _type="file" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            );
    }
}

export async function getServerSideProps(context:any) {

    const session = await getServerSession(context.req, context.res, authOption)
    const email =session?.user?.email;
    const resp = await fetch("http://localhost:8000/auth/user?email="
            + email);
    const res = await resp.json();
    console.log(res);
    return {
      props: {  
        emailExists: true
      },
    };
}

export default loginPage;