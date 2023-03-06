import { getServerSession } from "next-auth/next"
import UpdateProfile from "@/components/profile/UpdateProfile";

interface session {
  AuthMethod: string,
   accessToken:string
}

function loginPage({session,email,fullname,image }: 
          { session: string,email:string,fullname:string,image:string }) {
      console.log(`session : ${session}`);
      console.log(`email : ${email}`);
      console.log(`fullanme : ${fullname}`);
      console.log(`image : ${image}`);
      return (
        <div className="grid h-screen place-items-center items-start ">
            <UpdateProfile session={session} email={email} fullname={fullname}  
            image={image}/>
        </div>

      )
}

export async function getServerSideProps(context:any) {

// Checking the validity of ACCESS TOKEN NOT DONE YET !!!
  const jwt_token : string = context.req.cookies["jwt_token"];
  if (!jwt_token)
  {
      const session : session = JSON.parse(context.req.cookies["access_token"]);
      console.log(session);
    
      if ( session.AuthMethod !== "42" && session.AuthMethod !== "google"  )
      {
        console.log("hh");
        return {
          redirect : {
            destination : '/',
            permanent : true,
          }
        }
      }

      else if (session.AuthMethod == '42')
      {
          const resp = await fetch("https://api.intra.42.fr/v2/me",
                  { headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`,
                }})
              
          const data = await resp.json().catch((error) => {return {
                error : "Error occured while fetching data",
          }});
        
          return {
            props: {  
              session: session.AuthMethod,
              email:data.email as string,
              fullname:data.displayname as string,
              image:data.image.link as string
            },
          };
      }
      else if (session.AuthMethod == 'google')
      {
        const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo?access_token="
        + session.accessToken);
                
    
          const data = await resp.json().catch((error) => {return {
                error : "Error occured while fetching data",
          }});
    
          return {
            props: {  
              session: session.AuthMethod,
              email:data.email as string,
              fullname:data.name as string,
              image:data.picture as string
            },
          };
      }
  }
  //  to check the validity of jwt before redirecting later 
  return {
    redirect : {
      destination : '/profile',
      permanent : true,
    }
  }
}

export default loginPage;