import React from 'react';
import styles from '../../styles/components/ui/Dialog.module.css'; // Make sure to add a custom class for styling

const Dialog = ({ children, onClose }) => {
  return (
    <>
      <div className={styles.overlay} onClick={onClose} /> {/* Optional overlay to close the dialog */}
      <div className={styles.dialog}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        {children} {/* Render the child dialog component */}
      </div>
    </>
  );
};

export default Dialog;
