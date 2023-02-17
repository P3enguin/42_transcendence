import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { SessionProvider } from "next-auth/react"
import styles from '@/styles/Home.module.css'

export default function App({ Component, pageProps:{session, ...pageProps} }: AppProps) {
  return (
    
    <SessionProvider session={session}>
      {/* <Layout> */}
      <div className="bg-gradient-to-r from-[#2C3B7C] to-[#0D1743] ">
        <Component {...pageProps} />
      </div>
      {/* </Layout> */}
    </SessionProvider>
  )

}