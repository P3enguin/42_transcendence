import { cookies } from "next/headers";
import { useSearchParams } from "next/navigation";

function callbackFuc() {
  
  return <>hh</>;
}

export async function getServerSideProps(context:any) {

    console.log(context.req.url);
    const search = context.req.url.split('=')[1];
    console.log(search);
      const resp = await fetch(
        "http://localhost:8000/auth/42-callback?" + new URLSearchParams({
            code: search,}
      ));
      const data = await resp.json();
      console.log(data);
    
    // const session42 : string  = context.req.cookies["42access_token"];
    // if (!session42)
    // {
    //   return {
    //     redirect : {
    //       destination : '/',
    //       permanent : true,
    //     }
    //   }
    // }
  
    //   // const session = await getServerSession(context.req, context.res, authOption)
    //   // if (!session) {
    //   //     return {
    //   //       redirect: {
    //   //         destination: '/',
    //   //         permanent: false,
    //   //       },
    //   //     }
    //   //   }
    //   // const email =session?.user?.email;
    //   // const resp = await fetch("http://localhost:8000/auth/user?email="
    //   //         + email);
    //   // const res = await resp.json();
    //   // console.log(res);
    //   // if (res.nickname)
    //   // // here I should create a jwt token, I guess 
    //   // return {
    //   //     redirect : {
    //   //         destination: '/user',
    //   //         permanent:true,
    //   //     }
    //   // }
      return {
        props: {  
          session42: true,
        },
      };
  }
export default callbackFuc;
