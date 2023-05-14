function Message({message, side}: {message: any, side: string}) {

    // useEffect (()=>{

    // }, [message])

    return (
        <>
        <div className="imessage conversation">
          <p className={`${side} `}>
          <object data="/chat_tail_right.svg" type="image/svg+xml" className=" absolute right-0 translate-x-1 bottom-0" ></object>
            {message.message} from {message.sender} {side}
          </p>
          <p>{message.time}</p>
          <p className={`${side} `}>
          <object data="/chat_tail_left.svg" type="image/svg+xml" className=" absolute left-0 -translate-x-1 bottom-0" ></object>
            {message.message} from {message.sender} {side}
          </p>
          <p>{message.time}</p>
        </div>
        </>
    );
}

export default Message;