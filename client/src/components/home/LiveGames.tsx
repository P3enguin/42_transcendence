import LiveGame from './LiveGame';

function LiveGames() {
  return (
    <div className="w-full rounded-[20px] border border-white">
      <div className="flex items-center pl-4 pt-4">
        <div className="h-[12px] w-[12px] rounded-full bg-[#EB2230]"></div>
        <h1 className="pl-2 text-xl font-bold uppercase">Live Games:</h1>
      </div>
      <div className="max-h-[580px] overflow-auto">
        <ul className="flex flex-col py-4 px-9">
          <li className="p-2">
            <LiveGame
              nickname1="Emily"
              avatar1="/pfp1.png"
              nickname2="Zac"
              avatar2="/pfp1.png"
              score="1-0"
              watchLink="/game/id"
            />
          </li>
          <li className="p-2">
            <LiveGame
              nickname1="Emily"
              avatar1="/pfp1.png"
              nickname2="Zac"
              avatar2="/pfp1.png"
              score="1-0"
              watchLink="/game/id"
            />
          </li>
          <li className="p-2">
            <LiveGame
              nickname1="Emily"
              avatar1="/pfp1.png"
              nickname2="Zac"
              avatar2="/pfp1.png"
              score="1-0"
              watchLink="/game/id"
            />
          </li>
          <li className="p-2">
            <LiveGame
              nickname1="Emily"
              avatar1="/pfp1.png"
              nickname2="Zac"
              avatar2="/pfp1.png"
              score="1-0"
              watchLink="/game/id"
            />
          </li>
          <li className="p-2">
            <LiveGame
              nickname1="Emily"
              avatar1="/pfp1.png"
              nickname2="Zac"
              avatar2="/pfp1.png"
              score="1-0"
              watchLink="/game/id"
            />
          </li>
          <li className="p-2">
            <LiveGame
              nickname1="Emily"
              avatar1="/pfp1.png"
              nickname2="Zac"
              avatar2="/pfp1.png"
              score="1-0"
              watchLink="/game/id"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LiveGames;
