import React from 'react';
import '../../styles/components/Card.module.css';

const Card = ({ children, className, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
