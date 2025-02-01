import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Head>
        <title>Home Page</title>
      </Head>
      <Header />
      <main className="flex-grow flex justify-center items-center p-4">
        <div className="container mx-auto p-4">
          <h1 className="title text-3xl font-bold mb-4">Welcome to our app</h1>
          <p className="text-lg text-gray-text mb-4">Please sign in or sign up to continue</p>
          <div className="buttons">
            <button className="button bg-light-blue hover:bg-light-blue-dark text-gray-text mr-4" onClick={() => window.location.href = '/signin'}>
              Sign In
            </button>
            <button className="button bg-light-blue hover:bg-light-blue-dark text-gray-text" onClick={() => window.location.href = '/signup'}>
              Sign Up
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;