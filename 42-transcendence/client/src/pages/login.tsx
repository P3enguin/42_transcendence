import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import InputLabels from "@/components/profile/InputLabels";
import axios from "axios";


function loginPage() {

    const rout = useRouter();
    const {data: session,status} = useSession();
    console.log(session);
    if (status ==="authenticated")
    return (<div className="registration-container">
                <form action={process.env.BACKEND_DATA_POST}  method="post">
                    <InputLabels _id="username-label" _labelValue="Enter a Username" disabled={false} />
                    <InputLabels _id="picture-label" _labelValue="Enter a picture" disabled={false} _type="file" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    else if (status === "unauthenticated")
        rout.push("/");
}

export default loginPage;