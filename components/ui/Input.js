import React from 'react';
import '../../styles/components/ui/Input.module.css';

const Input = ({ className = '', ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <input
        className="input-field"
        {...props}
      />
    </div>
  );
};

export default Input;
