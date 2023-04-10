import axios from "axios";
import { useRouter } from 'next/router';
import { useState } from 'react';

function StartNew(data: any) {
  const router = useRouter();

  // function RoomForm() {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [key, setKey] = useState('');
    const [memberLimit, setMemberLimit] = useState(50);
    const [stats, setStats] = useState('');
    const [isChannel, setIsChannel] = useState(true);
    const [adminId, setAdminId] = useState(data.id);

    const [nameEntered, setNameEntered] = useState(false);
    const [statsEntered, setStatEntered] = useState(false);
    const [privateEntered, setPrivateEntered] = useState(false);

      async function createRoom(event : React.FormEvent) {) {
        
      const room = {
        name,
        topic,
        key,
        memberLimit,
        stats,
        isChannel,
        adminId,
      };
    const res = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/CreateRoom',
      room,
    ).then(res => {
        console.log("======>",res.data);
      router.push(/chat/ + res.data)})
    .catch(err => console.log(err));
  }

    return (
        <div className="flex flex-col w-[100%] h-[95%] border-t m-auto">
            <div className="sm:items-center lg:flex w-[100%]
                  h-[30%] text-3xl text-center lg:text-start">
              <div className=" lg:m-5 flex h-[15%] w-[100%] flex-col  self-end">Select a Chat or <br/>
                  Start a New:</div>
            </div>
            <div className="flex h-full w-full flex-col lg:flex-row ">
              <div className="sm:flex sm:items-center lg:flex m-auto mb-0 flex-col self-center h-[85%] w-[70%] ">
                <div className="sm:h-[2%] lg:flex flex-col h-[10%] w-[90%] ">
                  <h2 className="flex text-xl">Channel : </h2>
                  <form onSubmit={createRoom}>
                    <input
                      type="text"
                      name="channel"
                      id="channel"
                      className="border-white w-[90%] peer block w-full appearance-none
                      rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-sm
                      text-white focus:border-blue-600 focus:outline-none "
                      placeholder="channel name"
                      required
                      onChange={(e) => {
                        setName(e.target.value)
                        setNameEntered(e.target.value !== '');
                        }} />
                        {
                          nameEntered && (
                          <div className="flex flex-col">
                        <div className="inline-flex items-center  whitespace-nowrap">
                        <input
                            type="radio"
                            id="public"
                            name="type"
                            onChange={(e) => {setStats(e.target.value)
                            setStatEntered(e.target.value !== '');}}
                            />
                          <label htmlFor="normal" className="m-1 whitespace-nowrap">
                            public
                          </label>
                          </div>
                          <div className="inline-flex items-center  whitespace-nowrap">
                        <input
                            type="radio"
                            id="private"
                            name="type"
                            onChange={(e) => {
                              setStats(e.target.value)
                              setStatEntered(e.target.value !== '')
                              setPrivateEntered(e.target.value !== '');
                          }}
                            />
                          <label htmlFor="normal" className="m-1 whitespace-nowrap">
                            private
                          </label>
                          </div>
                          <div className="inline-flex items-center  whitespace-nowrap">
                        <input
                            type="radio"
                            id="normal"
                            name="type"
                            onChange={(e) => {setStats(e.target.value)
                            setStatEntered(e.target.value !== '');}}
                          />
                          <label htmlFor="normal" className="m-1 whitespace-nowrap">
                            secret
                          </label>
                          </div>
                        </div>)
                        }{
                          privateEntered &&
                        (<input
                          type="text"
                          name="key"
                          id="key"
                          className="border-white w-[90%] peer block w-full appearance-none
                          rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-sm
                          text-white focus:border-blue-600 focus:outline-none "
                          placeholder="channel password"
                          required
                          onChange={(e) => {
                            setKey(e.target.value)
                            }} />
                        )}{
                          statsEntered &&
                        (<input
                          type="text"
                          name="Topic"
                          id="Topic"
                          className="border-white w-[90%] peer block w-full appearance-none
                          rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-sm
                          text-white focus:border-blue-600 focus:outline-none "
                          placeholder="channel Topic"
                          onChange={(e) => {
                            setTopic(e.target.value);
                            }} />
                        )}
                      <button
                      name="create"
                      className="border-white m-auto mt-2 peer  appearance-none sm:mt-20 block
                      rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-s w-[50%] sm:w-[100px]
                        w-[50%] text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 lg:mt-60 lg:ml-20"
                        
                        >
                        Create
                      </button>
                  </form>
                  </div>
              </div>

              {!nameEntered && (<div className="flex m-auto mb-0 flex-row self-center h-[85%] w-[70%]">
                <div className="flex flex-col h-[10%] w-[90%]">
                  <h2 className="flex text-xl whitespace-nowrap ">Direct Message :</h2>
                  <div className="sm:flex flex-col relative flex items-center justify-center ">
                  <input type="text" name="nickname" id="nickname"
                    className=" border-white w-[90%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs sm:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 overflow-hidden"
                    placeholder="player" required/>
                    <button 
                      type="submit"
                      className="lg:right-0 lg:top-0 lg:absolute border-white peer block appearance-none mt-2
                            rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-sm w-[50%] sm:w-[100px]
                             text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 sm:m-5 lg:m-0"
                             
                             >
                      start
                    </button>
                  </div>
                </div>
              </div>)}
              </div>
              </div>
    );
// }
}
export default StartNew;