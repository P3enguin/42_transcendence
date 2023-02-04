import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";


function loginPage() {

    const {data :session , status} =  useSession();
    
    if (status == "authenticated")
        console.log(session.user);
    return <div>hh</div>
    // const rout = useRouter();
    // const {data: session,status} = useSession();
    // console.log(session);
    // if (status ==="authenticated")
    //     return (<div>
    //         <p>hh</p>
    //     </div>);
    // else if (status === "unauthenticated")
    //     rout.push("/");
}

export default loginPage;