import Image from 'next/image';

function Message({ message, side }: { message: any; side: boolean }) {
  // useEffect (()=>{

  // }, [message])
  // className="sm:h-12 sm:w-12 rounded-full absolute right-0 bottom-0 translate-x-[100%] translate-y-[50%]"
  const avatar =
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/avatars/' + message.senderAvatar;
  return (
    <>
      {side && (
        // div className=" relative left-[36%] flex flex-row-reverse rounded-full bg-[#0097E2] max-w-[70%] lg:max-w-[50%] mb-1 mt-2">
        <div className="relative flex max-w-[50%] md:max-w-[70%] self-end rounded-full my-2 bg-[#0097E2] p-2 px-5">
          <object
            data="/chat_tail_right.svg"
            type="image/svg+xml"
            className=" absolute bottom-0 right-0 -z-10 translate-x-1"
          ></object>
          <Image
            src={avatar}
            alt="channel"
            width={40}
            height={40}
            className="absolute bottom-0 right-0 h-[40px] w-[40px] translate-x-[107%] translate-y-[50%] rounded-full"
          />
          <p className="absolute -top-3 right-3.5 text-ss ">{message.sender}</p>

          <p className="whitespace-break-spaces text-right">{message.message}</p>

          <p className="absolute bottom-0 left-4 text-ss">{message.time}</p>
        </div>
      )}

      {!side && (
        <div className="relative mb-1 ml-12 mt-2 flex max-w-[50%] flex-row rounded-full bg-[#01FD91]">
          <object
            data="/chat_tail_left.svg"
            type="image/svg+xml"
            className=" absolute bottom-0 left-0 -translate-x-1"
          ></object>
          <Image
            src={avatar}
            alt="channel"
            width={40}
            height={40}
            className="absolute bottom-0 left-0 h-[40px] w-[40px] -translate-x-11 translate-y-[50%] rounded-full"
          />
          <div className=" m-auto w-[90%] ">
            <p className="absolute -top-3 flex text-ss "> {message.sender} </p>
            <p className="ml-2 mt-2 flex text-black"> {message.message} </p>
            <p className="flex justify-end pr-2 text-ss text-black">
              {' '}
              {message.time}{' '}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
