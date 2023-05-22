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
        <div className="relative my-3 flex max-w-[50%] self-end 
        rounded-xl bg-[#0097E2] p-2 px-5 md:max-w-[70%]">
          <Image
            src={avatar}
            alt="channel"
            width={40}
            height={40}
            className="absolute bottom-0 right-0 h-[40px] w-[40px] border translate-x-[107%] translate-y-[50%] rounded-full"
          />
          <object
            data="/chat_tail_right.svg"
            type="image/svg+xml"
            className=" absolute bottom-0 right-0 -z-10 translate-x-1"
          ></object>
          <p className="absolute -top-4 right-3.5 text-sm ">{message.sender}</p>
          <p
            className="break-words text-left text-black"
            style={{
              wordBreak: 'break-word',
            }}
          >
            {message.message}
          </p>
          <p className="absolute bottom-0 left-3 text-ss text-black">
            {message.time}
          </p>
        </div>
      )}

      {!side && (
        <div className="relative my-3 flex max-w-[50%] self-start rounded-xl bg-[#01FD91] p-2 px-5 md:max-w-[70%]">
          <object
            data="/chat_tail_left.svg"
            type="image/svg+xml"
            className=" absolute bottom-0 left-0 -z-10 -translate-x-1"
          ></object>
          <Image
            src={avatar}
            alt="channel"
            width={40}
            height={40}
            className="absolute bottom-0 left-0 h-[40px] w-[40px] border -translate-x-11 translate-y-[50%] rounded-full"
          />
          <p className="absolute -top-4 left-3.5 flex text-sm ">
            {' '}
            {message.sender}{' '}
          </p>
          <p
            className=" break-words text-left text-black"
            style={{
              wordBreak: 'break-word',
            }}
          >
            {' '}
            {message.message}{' '}
          </p>
          <p className="absolute bottom-0 right-3 text-ss text-black">
            {' '}
            {message.time}{' '}
          </p>
        </div>
      )}
    </>
  );
}

export default Message;
