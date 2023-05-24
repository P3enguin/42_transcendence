import Head from 'next/head';
import Image from 'next/image';
import Simulation from '@/components/home/Simulation';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Login from '@/components/home/LoginHome';
import NavBar from '@/components/home/NavBar';
import HomeText from '@/components/home/homeText';
import { verifyToken } from '@/components/VerifyToken';
import Router from 'next/router';

export default function Home({ authenticated }: { authenticated: boolean }) {
  const simRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState([
    { name: 'Home', current: true, animation: { rotate: 0 } },
    { name: 'About', current: false, animation: { rotate: -90 } },
    { name: 'Contact', current: false, animation: { rotate: 90 } },
  ]);
  const [animate, setAnimation] = useState({ rotate: 0 });
  const [join, setJoin] = useState(false);

  function handleClick(e: React.MouseEvent, index: number) {
    e.preventDefault();
    setJoin(false);
    const updatedState = state.map((item, i) => {
      if (i == index) {
        item.current = true;
        setAnimation(item.animation);
      } else item.current = false;
      return item;
    });
    setState(updatedState);
  }

  function handleJoin(e: React.MouseEvent) {
    const updatedState = state.map((item, i) => {
      item.current = false;
      return item;
    });
    setState(updatedState);
    setJoin(true);
  }

  function getImageStyle() {
    if (state[0].current) return 'px-4 shrink-0 lg:h-full h-1/4';
    else if (state[1].current || state[1].current)
      return 'w-3/5 md:max-xl:w-4/5 xl:w-full ';
  }

  useEffect(() => {
    if (authenticated) Router.push('/profile');
  }, [authenticated]);

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Ping Pong</title>

          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        {/* Navigation bar component */}
        <NavBar state={state} handleClick={handleClick} />
        {/* Home Content components */}
        <div className="h-[calc(100vh-80px)] min-h-[400px] overflow-hidden pt-10 xl:p-0">
          <div
            ref={simRef}
            className={`relative flex  h-[100%] flex-col-reverse items-center
                      justify-end gap-12 
                      ${
                        join ? 'xl:flex-row-reverse' : 'xl:flex-row'
                      } xl:justify-center
                     `}
          >
            <motion.div
              key="img"
              layoutId="test"
              initial={true}
              animate={animate}
              transition={{ type: 'Tween', ease: 'easeOut', duration: 0.5 }}
              exit={{ opacity: 0 }}
              className=""
            >
              <div className={getImageStyle()}>
                <Simulation
                  gameRef={simRef}
                  isRotated={state[1].current || state[2].current}
                  isContact={state[2].current}
                />
                {/* <Image src="/game.png" alt="game" width={700} height={700} /> */}
              </div>
            </motion.div>
            {state[0].current && <HomeText handleJoin={handleJoin} />}
            {join && <Login />}
          </div>
        </div>
      </>
    );
  }
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    try {
      const res = await verifyToken(req.headers.cookie);
      if (res.ok) {
        return {
          props: {
            authenticated: true,
          },
        };
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }
  return {
    props: {
      authenticated: false,
    },
  };
}
