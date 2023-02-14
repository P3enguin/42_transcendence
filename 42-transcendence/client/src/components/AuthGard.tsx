import { Router, useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { Session } from "inspector";

async function getData(email : string) {
    console.log("hh");
    const resp = await fetch("http://localhost:8000/auth/user?email="
            + email);
    const res = await resp.json();
    if (res.nickname)
        return true;
    return false;
}

export  function AuthGuard({children}: {children: JSX.Element}):JSX.Element {

    const {data,status } = useSession()
    const router = useRouter();

    console.log(status);
    if (!status)
        router.push("/");
    else if (status === "loading") 
        return <div>Loading...</div>
    else {
        const email =data?.user?.email!;
        getData(email).then((res) => {
            if (res)
                return <>{children}</>
            else if (!res)
                router.push("/login");
        });
    }
    return <>{children}</>;
}

// export async function getServerSideProps(context:any) {

//     console.log("im here");
//     const session = await getServerSession(context.req,context.res,authOption);
//     if (!session)
//     return {
//         redirect :
//         {
//             destination:'/',
//             permanent:true,
//         }
//     }
//     const email =session?.user?.email;
//     const resp = await fetch("http://localhost:8000/auth/user?email="
//             + email);
//     const res = await resp.json();
//     if (res.nickname)
//         return;
//     return {
//       props: {  
//         destination:'/login',
//         permanent:false,
//       },
//     };
// }