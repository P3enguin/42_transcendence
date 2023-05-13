function Message({message, side}: {message: any, side: string}) {

    // useEffect (()=>{

    // }, [message])

    return (
        <div className="">
            <div className="imessage conversation">
                <p className={`${side} `}>{message.message} from {message.sender} {side}</p>
                <p>{message.time}</p>
            </div>
        </div>
    )
}

export default Message;