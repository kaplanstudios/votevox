import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../utils/auth"; // Ensure this is the correct path
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;
