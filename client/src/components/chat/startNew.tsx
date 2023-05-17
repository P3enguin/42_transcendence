import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { InputBtn, InputDefault, InputKey } from '../Input/Inputs';

function StartNew({ nickname, token }: { nickname: string; token: string }) {
  const router = useRouter();

  const [player1, setPlayer1] = useState('');

  const [description, setDescription] = useState('');

  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [key, setKey] = useState('');
  const [memberLimit, setMemberLimit] = useState(50);
  const [privacy, setPrivacy] = useState({
    privacy: '',
    description: '',
  });
  const [isChannel, setIsChannel] = useState(true);
  const [creator, setCreator] = useState(nickname);

  const [NicknameEntered, setNicknameEntered] = useState(false);

  async function createPrivateChat() {
    const res = await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          `/chat/create/dm?nickname=${player1}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        router.push(`/chat/${res.data.channelId}`);
      })
      .catch((err) => console.log('error : ', err));
  }

  async function createRoom(event: React.FormEvent) {
    event.preventDefault();
    const room = {
      name,
      topic,
      key,
      memberLimit,
      privacy: privacy.privacy,
    };
    console.log('creating Room', room);
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(room),
        credentials: 'include',
      },
    );
    if (res.status == 201) {
      const room = await res.json();
      console.log(room);
      router.push(`/chat/${room.channelId}`);
    }
  }

  return (
    <div className=" flex p-1 h-[95%] w-[100%] flex-col lg:pl-10 ">
      <div className="h-[15%] w-[100%] text-3xl sm:items-center md:h-[30%] pl-5 lg:flex lg:text-start">
        Select a Chat or <br />
        Start a New:
      </div>
      <div className="flex h-full w-full flex-col-reverse xl:flex-row lg:p-2">
        {
          <div className="mb-0 flex h-[85%] w-100% flex-col xl:w-[50%] ">
            {/* <div className=" h-[10%] w-[90%] flex-col sm:h-[2%] lg:flex border border-red-600"> */}
            <form onSubmit={createRoom}>
              <div className="flex xl:justify-end max-w-[400px]">
                <InputDefault
                  name="name"
                  id="name"
                  description="channel name"
                  setName={setName}
                />
              </div>

              {
                <div className="flex flex-row w-full">
                  <div className=" xl:pl-10 ">
                    <h3 className="">type: </h3>
                    <div className=" flex flex-col pl-10 pr-5 md:pr-0 ">
                      <div className=" flex flex-row items-center whitespace-nowrap">
                        <input
                          type="radio"
                          id="public"
                          disabled={name === ''}
                          name="type"
                          onChange={(e) => {
                            setPrivacy({
                              privacy: 'public',
                              description:
                                'Public channels are visible to everyone and can be discovered through search or browsing, and everyone can join.',
                            });
                          }}
                        />
                        <label
                          htmlFor="normal"
                          className=" whitespace-nowrap pl-2"
                        >
                          public
                        </label>
                      </div>
                      <div className=" inline-flex flex-row items-center whitespace-nowrap">
                        <input
                          type="radio"
                          id="private"
                          name="type"
                          disabled={name === ''}
                          onChange={(e) => {
                            setPrivacy({
                              privacy: 'private',
                              description:
                                'Private channels are visible to everyone and can be discovered through search or browsing, but they require a password to join.',
                            }); // disable secret radio button
                          }}
                          // disable if secret radio button is selected
                        />
                        <label
                          htmlFor="normal"
                          className=" whitespace-nowrap pl-2"
                        >
                          private
                        </label>
                      </div>
                      <div className=" inline-flex flex-row items-center whitespace-nowrap">
                        <input
                          type="radio"
                          id="secret"
                          name="type"
                          disabled={name === ''}
                          onChange={(e) => {
                            setPrivacy({
                              privacy: 'secret',
                              description:
                                'Secret channels rae invite-only channels that cannot be discovered through search or browsing.',
                            }); // enable secret radio button
                          }} // disable if private radio button is selected
                        />
                        <label
                          htmlFor="normal"
                          className=" whitespace-nowrap pl-2 "
                        >
                          secret
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className=" w-full md:max-w-[60%] text-ellipsis pl-2 pt-7 text-ss">
                    {privacy.description}
                  </div>
                </div>
              }
              {privacy.privacy === 'private' && (
                <div className="flex xl:justify-end max-w-[400px]">
                  <InputKey
                    name="key"
                    id="key"
                    description="channel's Key"
                    setKey={setKey}
                  />
                </div>
              )}
              {
                <div className="flex xl:justify-end max-w-[400px]">
                  <InputDefault
                    name="topic"
                    id="topic"
                    description="channel's Topic"
                    setName={setTopic}
                  />
                </div>
              }
              <div className="flex xl:justify-end ">
                <button
                  name="create"
                  className=" hover:text-s absolute mx-auto mt-1 transform 
                    rounded-full bg-[#0097E2] px-9 py-2
                    text-[10px] font-bold uppercase text-white 
                    shadow transition  duration-300 hover:scale-[115%] hover:bg-[#2C3B7C]
                    "
                >
                  Create
                </button>
              </div>
            </form>
          </div>
          // </div>
        }
        { (
          <div className="mb-0 flex h-[15%] w-full xl:w-[50%] flex-col xl:h-[85%] max-w-[400px] xl:items-center lg:pt-0  ">
            <InputBtn
              name="nickname"
              id="nickname"
              description="Direct Message"
              setName={setPlayer1}
              createPrivateChat={createPrivateChat}
            />
          </div>
        )}
      </div>
    </div>
  );
  // }
}
export default StartNew;
