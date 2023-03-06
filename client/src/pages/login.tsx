import { getServerSession } from "next-auth/next";
import UpdateProfile from "@/components/profile/UpdateProfile";

interface session {
  AuthMethod: string;
  accessToken: string;
}

function loginPage({
  session,
  email,
  firstName,
  lastName,
  image,
}: {
  session: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}) {
  return (
    <div className="grid h-screen place-items-center items-start ">
      <UpdateProfile
        session={session}
        email={email}
        firstName={firstName}
        lastName={lastName}
        image={image}
      />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  // Checking the validity of ACCESS TOKEN NOT DONE YET !!!
  const jwt_token: string = context.req.cookies["jwt_token"];
  if (!jwt_token) {
    const session: session = JSON.parse(context.req.cookies["access_token"]);
    console.log(session);

    if (session.AuthMethod !== "42" && session.AuthMethod !== "google") {
      console.log("hh");
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    } else if (session.AuthMethod == "42") {
      const resp = await fetch("https://api.intra.42.fr/v2/me", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const data = await resp.json().catch((error) => {
        return {
          error: "Error occured while fetching data",
        };
      });

      return {
        props: {
          session: session.AuthMethod,
          email: data.email as string,
          firstName: data.first_name as string,
          lastName: data.last_name as string,
          image: data.image.link as string,
        },
      };
    } else if (session.AuthMethod == "google") {
      const resp = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" +
          session.accessToken
      );

      const data = await resp.json().catch((error) => {
        return {
          error: "Error occured while fetching data",
        };
      });

      return {
        props: {
          session: session.AuthMethod,
          email: data.email as string,
          firstName: data.given_name as string,
          lastName: data.family_name as string,
          image: data.picture as string,
        },
      };
    }
  }
  //  to check the validity of jwt before redirecting later
  return {
    redirect: {
      destination: "/profile",
      permanent: true,
    },
  };
}

export default loginPage;
