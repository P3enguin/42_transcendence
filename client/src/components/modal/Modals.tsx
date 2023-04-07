import { Dispatch, SetStateAction } from 'react';
import { OTPInput } from '@/components/Input/Inputs';
import { verifyOTP } from '../tools/functions';
interface QrCodeProps {
  qrPath?: string;
  activated: boolean | undefined;
  toggleOpen: (index: number) => void;
  setActivated: Dispatch<SetStateAction<boolean | undefined>>;
}

function ModalActivate2FA({
  qrPath,
  toggleOpen,
  activated,
  setActivated,
}: QrCodeProps) {
  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (await verifyOTP(event, '/auth/confirm2FA')) setActivated(true);
  }

  return (
    <div
      className="absolute top-0 right-0  left-0  z-20  flex h-[calc(100%-1rem)] 
               w-full items-center justify-center bg-gray-500  bg-opacity-75 p-4 transition-opacity md:inset-0 md:h-full"
    >
      <div className="relative h-full w-full max-w-2xl md:mb-[400px] md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 ">
          {/* <!-- Modal header --> */}
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Activate 2FA
            </h3>
            <button
              type="button"
              onClick={() => toggleOpen(0)}
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 "
              data-modal-hide="defaultModal"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          {!activated && (
            <div className="flex flex-col items-center space-y-6  p-6">
              <p className="text-base leading-relaxed text-gray-500 ">
                Please Scan The QR code first !
              </p>
              <img src={qrPath}></img>
              <p className="text-center text-base leading-relaxed text-gray-500 ">
                Then Enter the 6 digits found in your Google Authenticator app
                below 👇
              </p>
              <form onSubmit={verify}>
                <div className=" mb-6">
                  <OTPInput />
                  <span
                    id="errorSpan"
                    className="justify-even ml-4 mt-2 flex text-center text-xs text-red-700 md:text-sm"
                  ></span>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="flex items-center justify-center  pb-5">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4
                             focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    ACTIVATE
                  </button>
                </div>
              </form>
            </div>
          )}
          {activated && (
            <div className="flex flex-col items-center space-y-6  p-6">
              <svg
                viewBox="0 0 24 24"
                className="mx-auto my-6 h-16 w-16 text-green-600"
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <p className="text-base leading-relaxed text-gray-500 ">
                Successfully activated 2FA!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalDeactivate2FA({
  toggleOpen,
  activated,
  setActivated,
}: QrCodeProps) {
  async function deactivate2FA(event: React.FormEvent) {
    event.preventDefault();
    const password = (document.getElementById('password2FA') as HTMLInputElement).value;
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/deactivate2FA',
      {
        method: 'POST',
        body: JSON.stringify({
          password: password,
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
    if (res.ok) {
      setActivated(false);
    } else if (res.status === 403) {
      const result = await res.json();
      console.log(result);
      const span = document.getElementById('password2FASpan');
      if (span) span.innerHTML = result.error.message;
    }
  }

  return (
    <div
      className="absolute top-0 right-0  left-0  z-20  flex h-[calc(100%-1rem)] 
               w-full items-center justify-center bg-gray-500  bg-opacity-75 p-4 transition-opacity md:inset-0 md:h-full"
    >
      <div className="relative h-full w-full max-w-2xl md:mb-[400px] md:h-auto">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 ">
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Deactivate 2FA
            </h3>
            <button
              type="button"
              onClick={() => toggleOpen(1)}
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 "
              data-modal-hide="defaultModal"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {activated && (
            <div className="flex flex-col items-center space-y-6  p-6">
              <p className="text-center text-base leading-relaxed text-gray-500 ">
                Enter your password and click Confirm
              </p>
              <form onSubmit={deactivate2FA}>
                <div className=" mb-6">
                  <input
                    type="password"
                    name="password2FA"
                    id="password2FA"
                    className={` 
                    'border-gray-300'
                    peer block w-full appearance-none rounded-full border-2 bg-transparent 
                    py-2.5 px-3 text-center text-xs text-black
                  focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
                    placeholder="Password"
                  />

                  <span
                    id="password2FASpan"
                    className="justify-even ml-4 mt-2 flex text-center text-xs text-red-700 md:text-sm"
                  ></span>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="flex items-center justify-center  pb-5">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4
                             focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    CONFIRM
                  </button>
                </div>
              </form>
            </div>
          )}
          {!activated && (
            <div className="flex flex-col items-center space-y-6  p-6">
              <svg
                viewBox="0 0 24 24"
                className="mx-auto my-6 h-16 w-16 text-green-600"
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <p className="text-base leading-relaxed text-gray-500 ">
                Successfully deactivated 2FA!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { ModalActivate2FA, ModalDeactivate2FA };
