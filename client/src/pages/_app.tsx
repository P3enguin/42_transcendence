import "@/styles/globals.css";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import NextComponentType from "next";
import Layout from "@/components/layout/layout";

const App: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps: { ...pageProps },
}: AppLayoutProps) => {

  const getLayout = Component.getLayout || ((pageProps:React.ReactNode) => pageProps);

  return getLayout(<Component {...pageProps} />);
};

export default App;
