import UpdateProfile from '@/components/profile/UpdateProfile';
import { verifyToken, verifySession } from '@/components/VerifyToken';

function loginPage({
  email,
  firstName,
  lastName,
  image,
  coins,
}: {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  coins: number;
}) {
  return (
    <div className="grid h-screen place-items-center items-start ">
      <UpdateProfile
        email={email}
        firstName={firstName}
        lastName={lastName}
        image={image}
        coins={coins}
      />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const jwt_token: string = context.req.cookies['jwt_token'];
  if (!jwt_token) {
    const response = await verifySession(context.req.headers.cookie);
    if (!response.ok) {
      const data = await response.json();
      return {
        redirect: {
          destination: '/',
          permanent: true,
        },
      };
    }
    const result = await response.json();
    return {
      props: {
        email: result.jwtDecoded.email,
        firstName: result.jwtDecoded.firstName ?? null,
        lastName: result.jwtDecoded.lastName ?? null,
        image: result.jwtDecoded.picture,
        coins: result.jwtDecoded.coins,
      },
    };
  }
  if (jwt_token) {
    const res = await verifyToken(context.req.headers.cookie);
    if (res.ok) {
      return {
        redirect: {
          destination: '/profile',
          permanent: true,
        },
      };
    }
  }
  //  to check the validity of jwt before redirecting later
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

export default loginPage;
