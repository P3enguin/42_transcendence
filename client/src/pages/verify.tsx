import { verifyToken, verify2FAToken } from '@/components/VerifyToken';
import Router from 'next/router';
import { OTPInput } from '@/components/Input/Inputs';
import { verifyOTP } from '@/components/tools/functions';

function Verify2fa() {
  async function verify(event: any) {
    event.preventDefault();
    if (await verifyOTP(event,"/auth/verify2FA"))
      Router.push('/profile');
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden  py-12">
      <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white px-6 pt-10 pb-9 shadow-xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="text-3xl font-semibold text-black">
              <p>2FA Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>
                Get a verification code from the{' '}
                <strong>Google Authenticator</strong> app
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={verify}>
              <div className="flex flex-col space-y-10">
                <div className="flex flex-col">
                  <OTPInput />
                  <span
                    id="errorSpan"
                    className="space-y-5 pt-3 text-center text-red-600"
                  ></span>
                </div>
                <div className="flex flex-col space-y-5 ">
                  <div>
                    <button
                      type="submit"
                      className="flex w-full flex-row items-center justify-center rounded-xl border border-none bg-blue-700 py-5 text-center text-sm text-white shadow-sm outline-none"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const jwt_token: string = context.req.cookies['jwt_token'];
  if (!jwt_token) {
    const response = await verify2FAToken(context.req.headers.cookie);
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
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
        email: 'hh',
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
export default Verify2fa;
