import { Dispatch, SetStateAction } from 'react';

interface QrCodeProps {
  qrPath: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function ModalQRcode({ qrPath, setIsOpen }: QrCodeProps) {
  return (
    <div
      id="defaultModal"
      className="absolute top-0 right-0  left-0  z-20  flex h-[calc(100%-1rem)] 
               w-full items-center justify-center bg-gray-500  bg-opacity-75 p-4 transition-opacity md:inset-0 md:h-full"
    >
      <div className="relative h-full w-full max-w-2xl md:mb-[400px] md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 ">
          {/* <!-- Modal header --> */}
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Scan QR Code
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
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
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="flex flex-col items-center space-y-6  p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Please Scan The QR code first !
            </p>
            <img src={qrPath}></img>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-center">
              Then Enter the 6 digits found in your Google Authenticator app
              below 👇
            </p>
            <form>
              <div className=" mb-6">
                <input
                  type="input"
                  name="input2FA"
                  id="input2FA"
                  className={` 
                  'border-gray-300'
                  peer block w-full appearance-none rounded-full border-2 bg-transparent 
                  py-2.5 px-3 text-xs text-black text-center
                focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
                placeholder="6-digits"
                  />
  
                <span
                  id="input2FASpan"
                  className="justify-even ml-4 mt-2 flex text-xs text-red-700 md:text-sm"
                  >dgdfg</span>
              </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-center  pb-5">
            <button
              type="button"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
              ACTIVATE
            </button>
          </div>
          </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalQRcode;
