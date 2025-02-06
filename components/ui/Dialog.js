// components/ui/Dialog.js

import React from "react";
import styles from "../../styles/components/ui/Dialog.module.css"; // Assuming you have some styles for the dialog

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render the dialog if it's not open

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dialogContainer}>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
        {children} {/* Render passed children */}
      </div>
    </>
  );
};

export default Dialog;
