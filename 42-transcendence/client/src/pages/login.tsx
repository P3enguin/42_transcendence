import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";


function loginPage() {

    const rout = useRouter();
    const {data: session,status} = useSession();
    console.log(session);
    if (status ==="authenticated")
    return (<div>
            <p>hh</p>
        </div>);
    else if (status === "unauthenticated")
        rout.push("/");
    return <div>hh</div>
}

export default loginPage;