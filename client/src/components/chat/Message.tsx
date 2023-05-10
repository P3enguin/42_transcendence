function Message(message: any, time: string) {

    // useEffect (()=>{

    // }, [message])

    return (
        <div>
            <div className="conversation">
                {/* {message.map((messages) => (
                    <div key={messages.id} className="message">
                    <span className="sender">{message.sender}</span>
                    <span className="text">{message.text}</span>
                    </div>
                ))} */}
                </div>
        </div>
    )
}

export default Message;