import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ComponentType,useEffect } from "react";
import { NextComponentType } from "next";

/* The  HOC technique is being used to protect the pages  */ 
/* <P extends object> : generic type.
- Our component type is componentType<P>, P are the props passed */ 


async function getUser(email:string) {

}

function ProtectComponent(ComponentToBeProtected : NextComponentType) {

    const ProtectComponent = (props: any) => {
        const {data: session,status} = useSession();
        const router = useRouter();

        useEffect(() => {
            if (!session && status != "loading")
                router.push("/");
            async () => {
                const email =session?.user?.email;
                const resp = await fetch("http://localhost:8000/auth/user?email="
                + email);
                const res = await resp.json();
                if (res.nickname)
                    return ;
                else
                    router.push("/login");
            }
        },[session,status,router]);
        if (status == "loading")
            return (<div>Loading data please wait ...</div>)
    }
    return ProtectComponent;
}

export default ProtectComponent;


// alaoui : Mimo797979@@@ 
// asm : AtRt!Ok060086