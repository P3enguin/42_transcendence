import React from "react";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import axios from "axios";


function authCodePage() {
    
    const rout = useRouter();

    // const code:string = rout.asPath.split('=')[1];
    // console.log(code);
    // if (code)
    // {
    //      axios.get('http://localhost:8000/auth/access',{
    //         params: {code: code},
    //     }).then((resp) => {console.log(resp.data)})
    //     .catch((err) => {
    //         console.log(err);
    //     })
    // }
    return (<div>fetching Data... please Wait</div>);
}

export default authCodePage;


