import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Player from '@/components/profile/Player';
import { Blocked } from '@/components/profile/Player';
interface players {
  nickname: string;
  avatar: string;
}

function BlockedPage({ nickname }: { nickname: string }) {
  const [blockedList, setBlockedList] = useState<players[]>([]);
  const [isloading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getPLayers(nickname: string) {
      try {
        setLoading(true);
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST +
            '/players/blocked?' +
            new URLSearchParams({ nickname: nickname }),
          {
            credentials: 'include',
          },
        );
        if (!response.ok) {
          const err = await response.json();
          if (err.error.message) throw new Error(err.error.message);
          else throw new Error('An unexprected error occurred');
        } else if (response.ok) {
          const data = await response.json();
          setBlockedList(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        // const span = document.getElementById('error-span');
        // if (error instanceof Error) {
        //   if (span) span.innerHTML = error.message;
        // }
      }
    }
    getPLayers(nickname);
  }, [nickname]);

  async function unblockPlayer(e: React.MouseEvent, nickname: string) {
    e.preventDefault();
    try {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/unblock',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: nickname }),
          credentials: 'include',
        },
      );
      if (resp.ok) {
        const newBlocklist = blockedList.filter(
          (blocked) => blocked.nickname != nickname,
        );
        setBlockedList(newBlocklist);
        console.log('unblocked');
      } else {
        console.log('cannot unblock');
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }

  return (
    <div
      className="mt-[40px] flex h-[750px] w-11/12 flex-col
                gap-5 rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6 xl:w-[1000px] "
    >
      <h1 className="mt-5 text-center text-[35px]">Blocked Users</h1>
      <div className="flex  min-h-[233px] w-full flex-wrap justify-center gap-10 overflow-scroll p-6 scrollbar-hide sm:gap-10 ">
        {isloading ? (
          <div>Fetching data...</div>
        ) : blockedList.length == 0 ? (
          <p> You have no enemies</p>
        ) : (
          blockedList!.map((player, index) => (
            <div key={index} className="h-[20px] w-[150px]">
              <Blocked
                nickname={player.nickname}
                avatar={
                  process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
                  '/avatars/' +
                  player.avatar
                }
                unblockPlayer={unblockPlayer}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];

  if (jwt_token) {
    try {
      const res = await verifyToken(req.headers.cookie);

      if (res.ok) {
        const data = (await res.json()) as players;
        return {
          // modify this to return anything you want before your page load
          props: {
            nickname: data.nickname,
          },
        };
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

BlockedPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default BlockedPage;
