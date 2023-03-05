import { getServerSession } from "next-auth/next"
import UpdateProfile from "@/components/profile/UpdateProfile";

function loginPage({session42,email,fullname,image }: 
          { session42: string,email:string,fullname:string,image:string }) {

      return (
        <div className="grid h-screen place-items-center items-start ">
            <UpdateProfile session42={session42} email={email} fullname={fullname}  
            image={image}/>
        </div>

      )
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
  console.log(session42);
  const resp = await fetch("https://api.intra.42.fr/v2/me",
          { headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${session42}`,
        }})
      
  const data = await resp.json().catch((error) => {return {
        error : "Error occured while fetching data",
  }});

    return {
      props: {  
        session42: session42,
        email:data.email as string,
        fullname:data.displayname as string,
        image:data.image.link as string
      },
    };
}

export default loginPage;