interface NotifInterface {
  username: string;
  image: string;
}

function NotiAddFriend({ username, image }: NotifInterface) {
  return (
    <div className="-mx-2 flex items-center border-b px-4 py-3 hover:bg-[#8fd4f6]">
      <div className="w-1/5">
        <img
          className="h-12 w-12 rounded-full border border-gray-100 shadow-sm"
          src={image}
          alt="user image"
        />
      </div>
      <div className="w-4/5 text-sm text-[#2F3C78]">
        <div>
          <span className="font-bold ">{username} </span>
          <span>wants to be your friend</span>
        </div>
        <div className="font-bold">
          <button className="mr-2 text-blue-600">Accept</button>
          <button className="text-red-500">Decline</button>
        </div>
      </div>
    </div>
  );
}

function NotiAccept({ username, image }: NotifInterface) {
  return (
    <div className="-mx-2 flex items-center border-b px-4 py-3 hover:bg-[#8fd4f6]">
      <div className="w-1/5">
        <img
          className="h-12 w-12 rounded-full border border-gray-100 shadow-sm"
          src={image}
          alt="user image"
        />
      </div>
      <div className="w-4/5 text-sm text-[#2F3C78]">
        <div>
          <span className="font-bold ">{username}{" "}</span>
          <span>
            accepted your{' '}
            <span className="font-bold text-blue-500">Friend Request!</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export { NotiAddFriend,NotiAccept };
