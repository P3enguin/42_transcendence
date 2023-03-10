import "@/styles/globals.css";
import type { AppProps } from "next/app";
import styles from "@/styles/Home.module.css";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import NextComponentType from "next";
import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

const App: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps: { ...pageProps },
}: AppLayoutProps) => {
  return <Component {...pageProps} />;
};

export default App;
