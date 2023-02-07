import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import InputLabels from "@/components/profile/InputLabels";
import axios from "axios";


async function handleSubmit(event:any) {
    event.preventDefault();

    const data = {
        username: event.target.username.value,
        // picture: event.target.picture.value,
    }
    const url:string = 'http://localhost:8000/auth/data'
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }    
    const response = await fetch(url, options)
    const result = await response.json();
    console.log(result);
}

function loginPage() {

    const rout = useRouter();
    const {data: session,status} = useSession();
    console.log(session);
    if (status ==="authenticated")
    return (<div className="registration-container">
                <form onSubmit={handleSubmit}>
                    <InputLabels _id="username" _labelValue="Enter a Username" disabled={false} />
                    <InputLabels _id="picture" _labelValue="Enter a picture" disabled={false} _type="file" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    else if (status === "unauthenticated")
        rout.push("/");
}

export default loginPage;