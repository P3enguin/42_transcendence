import React from 'react';
import { SendIcon } from '../icons/Icons';

const MessageLabel = ({ socket, id }: any) => {
  const [message, setMessage] = React.useState('');

  const sendMessage = (message: string) => {
    if (socket) {
      console.log('Sending message');
      socket.emit('sendMessage', { message: message, id });
    }
  };

  return (
    <div className="relative mb-2 w-[90%] flex-col items-center sm:flex">
      <input
        type="text"
        name="nickname"
        id="nickname"
        className="text-xs peer block w-full appearance-none overflow-hidden rounded-full border-2 border-white bg-transparent px-3 py-2.5 pr-10 text-white focus:border-blue-600 focus:outline-none focus:ring-0 sm:text-sm"
        placeholder="Message . . ."
        required
        value={message}
        onChange={(e) => {
          e.preventDefault();
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && message != '') {
            e.preventDefault();
            sendMessage(message);
            setMessage('');
          }
        }}
      />

      <button
        type="submit"
        className="absolute right-[10px] top-[50%] m-auto translate-y-[-50%] rounded-full"
        onClick={(e) => {
          e.preventDefault();
          if (message != '') {
            sendMessage(message);
            setMessage('');
          }
        }}
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default MessageLabel;
