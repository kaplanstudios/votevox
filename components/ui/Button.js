import React from 'react';
import '../../styles/components/Button.module.css';

const Button = ({ children, onClick, className }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
