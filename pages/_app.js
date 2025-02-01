import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"; // Add global styles

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
