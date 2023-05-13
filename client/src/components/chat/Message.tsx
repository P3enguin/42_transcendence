function Message({message, time, side}: {message: string, time: string, side: string}) {

    // useEffect (()=>{

    // }, [message])

    return (
        <div className="">
            <div className="imessage conversation">
                <p className={`${side} `}>{message}</p>
            </div>
        </div>
    )
}

export default Message;