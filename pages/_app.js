import { SessionProvider } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/globals.css'; // Importing global styles

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      {/* Optional: You can include the Header here if you'd like it to be at the top of each page */}
      <Header />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
}

export default MyApp;
