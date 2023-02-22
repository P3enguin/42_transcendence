import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { SessionProvider } from "next-auth/react"
import styles from '@/styles/Home.module.css'
import { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import NextComponentType from "next"
import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion'


const App: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps:{session, ...pageProps}
}: AppLayoutProps) => {
  // const getLayout = Component.getLayout || ((page: React.ReactNode) => page);
  return (
    <SessionProvider session={session}>
      {/* {getLayout( */}
      <Component {...pageProps} />
      {/* )} */}
    </SessionProvider>
  )
};

export default App;
