import React from 'react';
import '../../styles/components/ui/Card.module.css';

const Card = ({ children, className, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      <div className="cardContent">{children}</div>
    </div>
  );
};

export default Card;
