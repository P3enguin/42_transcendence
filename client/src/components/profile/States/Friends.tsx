import Image from 'next/image';

function FriendStats() {
  return (
    <div className="flex h-3/4 min-h-[233px] w-full flex-wrap justify-center gap-10 p-6 ">
      <div className="flex h-1/4 w-[190px] items-center justify-between rounded-xl border  p-1">
        <div className="flex w-3/4 flex-row items-center gap-1">
          <img
            className="w-[45px] rounded-full sm:w-[48px]"
            src="/logo.png"
            alt="pfp"
          />
          <strong className="text-sm">@nickname</strong>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2 ">
          <button>
            <img
              src="/msgProfile.svg"
              alt="msg"
              className="h-[17px] w-[17px]"
            />
          </button>
          <button>
            <img src="/blockFriend.svg" alt="msg" className="h-[17px] w-[17]" />
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default FriendStats;
