import React from 'react';

const Header = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center px-4 py-2 bg-black w-fit max-w-full">
      <h1 className="text-white text-4xl font-bold mr-4 whitespace-nowrap">Ballotbox</h1>
      <p className="text-gray-400 text-xl">Democracy for Everyone</p>
    </header>
  );
};

export default Header;
