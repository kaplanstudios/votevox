// pages/_app.js
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
