import React from 'react';
import '../../styles/components/ui/Dialog.module.css';

const Dialog = ({ children, onClose }) => {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
