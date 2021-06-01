import { AppProps } from "next/dist/next-server/lib/router/router";
import "../../styles/global.scss";

import {Provider as NextAuthProvider} from 'next-auth/client'

import {Header} from "../Components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
    <Header/>
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp;
