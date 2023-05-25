import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { InputBtn, InputDefault } from '../Input/Inputs';

function StartNew({ nickname, token }: { nickname: string; token: string }) {
  const router = useRouter();

  const [player1, setPlayer1] = useState('');

  const [description, setDescription] = useState('');

  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [key, setKey] = useState('');
  const [memberLimit, setMemberLimit] = useState(0);
  const [privacy, setPrivacy] = useState({
    privacy: '',
    description: '',
  });
  const [isChannel, setIsChannel] = useState(true);
  const [creator, setCreator] = useState(nickname);

  const [NicknameEntered, setNicknameEntered] = useState(false);

  async function createPrivateChat() {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/dm?nickname=${player1}`,
      {
        credentials: 'include',
      },
    );

    if (response.status == 200 || response.status == 201) {
      const dmData = await response.json();
      router.push(`/chat/${dmData.channelId}`);
    }
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
    <div className=" flex h-[95%] w-[100%] flex-col p-1 lg:pl-10 ">
      <div className="sm:items-cente5  h-[15%] w-[100%] pl-5 text-2xl sx:text-3xl md:h-[30%] lg:flex  lg:text-start">
        Select a Chat or <br />
        Start a New:
      </div>
      <div className="flex h-full w-full flex-col-reverse lg:p-2 xl:flex-row">
        {
          <div className="w-100% mb-0 flex h-[85%] flex-col pl-5 xl:w-[50%]">
            {/* <div className=" h-[10%] w-[90%] flex-col sm:h-[2%] lg:flex border border-red-600"> */}
            <form onSubmit={createRoom}>
              <div className="mt-5 flex max-w-[400px] flex-col xl:mt-0 ">
                <div className="flex flex-col xl:ml-[10%]">
                  <p className="text-[14px] font-semibold uppercase  md:text-base">
                    Channel:
                  </p>
                  <InputDefault
                    className="group relative z-0 mb-2 w-[85.7%] min-w-[170px]"
                    name="name"
                    id="name"
                    type="input"
                    description="Channel name"
                    setName={setName}
                  />
                </div>
              </div>

              {
                <div className="flex w-full flex-row">
                  <div className=" xl:pl-10 ">
                    <h3 className="">type: </h3>
                    <div className=" flex flex-col px-1 sx:pl-10 sx:pr-5 md:pr-0">
                      <div className=" flex flex-row items-center whitespace-nowrap ">
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
                          htmlFor="public"
                          className={`whitespace-nowrap pl-2 ${
                            name === '' ? '' : 'cursor-pointer'
                          }`}
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
                          htmlFor="private"
                          className={`whitespace-nowrap pl-2 ${
                            name === '' ? '' : 'cursor-pointer'
                          }`}
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
                          htmlFor="secret"
                          className={`whitespace-nowrap pl-2  ${
                            name === '' ? '' : 'cursor-pointer'
                          }`}
                        >
                          secret
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className=" w-full text-ellipsis pl-2 pt-7 text-[10px] md:max-w-[60%]">
                    {privacy.description}
                  </div>
                </div>
              }
              {privacy.privacy === 'private' && (
                <div className="flex max-w-[400px] xl:justify-center">
                  <InputDefault
                    className="group relative z-0 mb-2 w-[86%] min-w-[170px] xl:w-3/4"
                    name="name"
                    id="name"
                    type="password"
                    description="Enter a key"
                    setName={setKey}
                  />
                </div>
              )}
              {
                <div className="flex max-w-[400px] xl:justify-center ">
                  <InputDefault
                    className="group relative z-0 mb-2 w-[86%] min-w-[170px] xl:w-3/4"
                    name="topic"
                    type="input"
                    id="topic"
                    description="Channel topic"
                    setName={setTopic}
                  />
                </div>
              }
              <div className="mt-3 flex max-w-[400px] pr-10 xl:justify-end">
                <div className="">
                  <button
                    name="create"
                    className=" hover:text-s mx-auto mt-1 transform 
                  rounded-full bg-[#0097E2] px-9 py-2
                  text-[10px] font-bold uppercase text-white 
                  shadow transition  duration-300 hover:scale-[115%] hover:bg-[#2C3B7C]
                  "
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
          // </div>
        }
        {
          <div className="mb-0 flex h-[15%] w-full max-w-[400px] flex-col pl-5 lg:pt-0 xl:h-[85%] xl:w-[50%] xl:items-center  ">
            <div className="flex h-full w-full flex-col">
              <p className="self-start text-[14px] font-semibold uppercase  md:text-base">
                Direct Message:
              </p>
              <InputBtn
                name="nickname"
                id="nickname"
                description="nickname"
                setName={setPlayer1}
                createPrivateChat={createPrivateChat}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
  // }
}
export default StartNew;
