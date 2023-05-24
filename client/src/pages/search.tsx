import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Player from '@/components/profile/Player';
interface players {
  nickname: string;
  avatar: string;
}

function Search() {
  const [players, setPlayers] = useState<players[]>([]);
  const [isloading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getPLayers(param: string) {
      try {
        setLoading(true);
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST +
            '/players/search?' +
            new URLSearchParams({ search: param }),
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
          setPlayers(data.players);
        }
      } catch (error) {
        console.log(error);
        // const span = document.getElementById('error-span');
        // if (error instanceof Error) {
        //   if (span) span.innerHTML = error.message;
        // }
      }
    }

    if (router.query.search) getPLayers(router.query.search as string);
    setLoading(false);
  }, [router.query]);

  return (
    <div
      className="mt-[40px] flex h-[750px] w-11/12 flex-col
                gap-5 rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6 xl:w-[1000px] "
    >
      <h1 className="text-center">Search for Players or Channels</h1>
      <div className="flex  min-h-[233px] w-full flex-wrap justify-center gap-10 overflow-scroll p-6 scrollbar-hide sm:gap-10 ">
        {isloading ? (
          <div>Fetching data...</div>
        ) : (
          players!.map((player, index) => (
            <div key={index} className="h-[20px] w-[150px]">
              <Player
                nickname={player.nickname}
                avatar={
                  process.env.NEXT_PUBLIC_BACKEND_HOST +
                  '/avatars/' +
                  player.avatar
                }
                userProfile={false}
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
        return {
          // modify this to return anything you want before your page load
          props: {
            jwt_token: jwt_token,
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

Search.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Search;
