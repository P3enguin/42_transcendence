import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputDefault, InputKey } from '../Input/Inputs';

function StartNew({ nickname, token }: { nickname: string; token: string }) {
  const router = useRouter();

  const [player1, setPlayer1] = useState('');

  const [description, setDescription] = useState('');

  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [key, setKey] = useState('');
  const [memberLimit, setMemberLimit] = useState(50);
  const [stats, setStats] = useState('');
  const [isChannel, setIsChannel] = useState(true);
  const [creator, setCreator] = useState(nickname);

  const [NicknameEntered, setNicknameEntered] = useState(false);

  async function createPrivateChat(event: React.FormEvent) {
    event.preventDefault();

    const chat = {
      player1,
      creator,
    };
    const res = await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/createPrivateChat',
        chat,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        console.log(res.data);
        router.push(/chat/ + res.data);
      })
      .catch((err) => console.log(err));
  }

  async function createRoom(event: React.FormEvent) {
    event.preventDefault();
    const room = {
      name,
      topic,
      key,
      memberLimit,
      stats,
      isChannel,
      creator,
    };
    console.log('creating Room', room);
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/CreateRoom',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({room,}),
        credentials: 'include',
      },
    );
    if (res.status == 200) {
      const roomId = await res.json();
      router.push(`/chat/${roomId}`);
    }
  }

  return (
    <div className=" flex h-[95%] w-[100%] flex-col md:pl-2">
      <div
        className="h-[15%] md:h-[30%] w-[100%] self-center
                  text-center text-3xl sm:items-center lg:flex lg:text-start"
      >
        Select a Chat or <br />
        Start a New:
      </div>
      <div className=" flex h-full w-full flex-col border p-2 lg:flex-row border border-yellow-300">
        {!NicknameEntered && (
          <div className=" mb-0 h-[85%] w-full md:w-[70%] flex-col items-center border border-red-600">
            {/* <div className=" h-[10%] w-[90%] flex-col sm:h-[2%] lg:flex border border-red-600"> */}
              <form onSubmit={createRoom}>

                <InputDefault name="name" id="name" description="channel name" setName={setName}/>

                {name && (
                  <div className="flex-row md:flex-col pr-1 md:p-2">
                    <h3 className='h-[38px] w-[38px]'>type: </h3>
                    <div className=" pr-5 md:pr-0 mt-2 flex flex-col pl-6 md:mt-5 items-center border">
                      <div className=" flex items-center flex-col md:flex-row whitespace-nowrap">
                        <input
                          type="radio"
                          id="public"
                          name="type"
                          onChange={(e) => {
                            setStats('public');
                          }}
                        />
                        <label htmlFor="normal" className=" whitespace-nowrap pl-2">
                          public
                        </label>
                       {stats === 'public' && ( <div className="text-xs md:pl-5 whitespace-normal text-ellipsis overflow-hidden w-[70%] md:text-center">
                                    Public channels are visible to everyone and can be discovered through search or browsing, and everyone can join.
                                  </div>)}
                      </div>
                      <div className=" inline-flex items-center flex-col md:flex-row whitespace-nowrap">
                        <input
                          type="radio"
                          id="private"
                          name="type"
                          onChange={(e) => {
                            setStats('private');
                            console.log(stats); // disable secret radio button
                          }}
                          // disable if secret radio button is selected
                        />
                        <label htmlFor="normal" className=" whitespace-nowrap pl-2">
                          private
                        </label>
                        {stats === 'private' && ( <div className="text-xs md:pl-5 whitespace-normal text-ellipsis overflow-hidden w-[70%] text-center">Private channels are visible to everyone and can be discovered through search or browsing, but they require a password to join.</div>)}
                      </div>
                      <div className=" inline-flex items-center flex-col md:flex-row whitespace-nowrap">
                        <input
                          type="radio"
                          id="secret"
                          name="type"
                          onChange={(e) => {
                            setStats('secret');
                            console.log(stats); // enable secret radio button
                          }} // disable if private radio button is selected
                        />
                        <label htmlFor="normal" className=" whitespace-nowrap pl-2 ">
                          secret
                        </label>
                        {stats === 'secret' && ( <div className="text-xs md:pl-5 whitespace-normal text-ellipsis overflow-hidden w-[70%] text-center">Secret channels rae invite-only channels that cannot be discovered through search or browsing.</div>)}
                      </div>
                    </div>
                  </div>
                )}
                {stats === 'private' && (
                 <InputKey name="key" id="key" description="channel's Key" setKey={setKey}/>
                )}
                {stats && name && (
                  <InputDefault name="topic" id="topic" description="channel's Topic" setName={setTopic}/>
                )}
                <button
                  name="create"
                  className=" hover:text-s absolute mx-auto mt-1 transform 
                                          rounded-full rounded-full bg-[#0097E2] px-9 py-2
                                          text-[10px] font-bold uppercase text-white 
                                          shadow transition  duration-300 hover:scale-[115%] hover:bg-[#2C3B7C]  
                                          
                                          "
                >
                  Create
                </button>
              </form>
            </div>
          // </div>
        )}

        {!name && (
          <div className=" m-auto flex h-[85%] w-[70%] flex-row self-center ">
            <div className=" flex h-[10%] w-[90%] flex-col ">
              <div className=" relative flex flex-col items-center justify-center sm:flex ">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  className="  peer block
                    w-[90%] w-full appearance-none overflow-hidden rounded-full border-2 border-white
                    bg-transparent py-2.5  px-3 text-xs 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="player"
                  required
                  onChange={(e) => {
                    setPlayer1(e.target.value);
                    setNicknameEntered(e.target.value !== '');
                  }}
                />
                <button
                  onClick={(e) => {
                    createPrivateChat(e);
                  }}
                  className=" hover:text-s absolute top-[50%] right-[9px] mx-auto 
                                      translate-y-[-50%] transform rounded-full rounded-full
                                      bg-[#0097E2] px-[12px] py-2 text-[10px] 
                                      font-bold uppercase  text-white shadow transition
                                      duration-300 hover:scale-[115%] hover:bg-[#2C3B7C]"
                >
                  start
                </button>
                {/* <button 
                      type="submit"
                      className=" lg:right-0 lg:top-0 lg:absolute border-white peer block appearance-none mt-2
                            rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-sm w-[50%] sm:w-[100px]
                             text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 sm:m-5 lg:m-0"
                             onClick={(e)=>{
                              createPrivateChat(e);
                             }}
                             >
                      start
                    </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  // }
}
export default StartNew;
