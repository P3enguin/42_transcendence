import { verifyToken,verify2FAToken } from "@/components/VerifyToken";
import Router from "next/router";


function Verify2fa() {
  function autoTab(field1 :string, len :number, field2 :string) {
    if ( (document.getElementById(field1) as HTMLInputElement).value.length == len) {
      (document.getElementById(field2) as HTMLInputElement).focus();
      }
  }
    
  function handleKeyUp(field1: string, len: number, field2: string) {
    return function handleAutoTab() {
      autoTab(field1, len, field2);
    }
  }

  async function verify2FA(event: any) {

    event.preventDefault() ;
    const span = document.getElementById('errorSpan');
    const nbr1 = event.target.numb1.value;
    const nbr2 = event.target.numb2.value;
    const nbr3 = event.target.numb3.value;
    const nbr4 = event.target.numb4.value;
    const nbr5 = event.target.numb5.value;
    const nbr6 = event.target.numb6.value;


    if (!nbr1 || !nbr2 || !nbr3 || !nbr4 || !nbr5 || !nbr6) {
      if (span)
        span.innerHTML = "Please enter all the digits !";
      return;
    }
    const token:string = nbr1 + nbr2 + nbr3 + nbr4 + nbr5 + nbr6;

    const resp = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/auth/verify2FA",{
      method:"POST",
      body: JSON.stringify({token:token}),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (resp.ok)
    {
      Router.push("/profile");
    }
    else if (resp.status === 400){
      const message  = await resp.json();
      if (span)
        span.innerHTML = "The code is invalid";
    }
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
            <form onSubmit={(event) => verify2FA(event)}>
              <div className="flex flex-col space-y-10">
                <div className="flex flex-col">
                  <div className="mx-auto flex w-full max-w-sm flex-row items-center justify-between gap-2 text-black">
                    <div className="h-16 w-16 ">
                      <input
                        className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                        type="text"
                        pattern="[0-9]"
                        maxLength={1}
                        name="numb1"
                        id="numb1"
                        onKeyUp={handleKeyUp('numb1',1,'numb2')}
                      />
                    </div>
                    <div className="h-16 w-16 ">
                      <input
                        className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                        type="text"
                        pattern="[0-9]"
                        maxLength={1}
                        name="numb2"
                        id="numb2"
                        onKeyUp={handleKeyUp('numb2',1,'numb3')}
                      />
                    </div>
                    <div className="h-16 w-16 ">
                      <input
                        className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                        type="text"
                        pattern="[0-9]"
                        maxLength={1}
                        name="numb3"
                        id="numb3"
                        onKeyUp={handleKeyUp('numb3',1,'numb4')}
                      />
                    </div>
                    <div className="h-16 w-16 ">
                      <input
                        className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                        type="text"
                        pattern="[0-9]"
                        maxLength={1}
                        name="numb4"
                        id="numb4"
                        onKeyUp={handleKeyUp('numb4',1,'numb5')}
                      />
                    </div>
                    <div className="h-16 w-16 ">
                      <input
                        className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                        type="text"
                        pattern="[0-9]"
                        maxLength={1}
                        name="numb5"
                        id="numb5"
                        onKeyUp={handleKeyUp('numb5',1,'numb6')}
                      />
                    </div>
                    <div className="h-16 w-16 ">
                      <input
                        className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                        type="text"
                        pattern="[0-9]"
                        maxLength={1}
                        name="numb6"
                        id="numb6"
                        // onKeyUp={handleKeyUp('hh',1,'hh')}
                      />
                    </div>
                  </div>
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
  const jwt_token: string = context.req.cookies["jwt_token"];
  if (!jwt_token) {
    const response = await verify2FAToken(context.req.headers.cookie);
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }
    const result = await response.json();
    return {
      props: {
        email: "hh",
      },
    };
  }
  if (jwt_token) {
    const res = await verifyToken(context.req.headers.cookie);
    if (res.ok) {
      return {
        redirect: {
          destination: "/profile",
          permanent: true,
        },
      };
    }
  }
  //  to check the validity of jwt before redirecting later
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
}
export default Verify2fa;
