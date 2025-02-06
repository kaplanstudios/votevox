// components/ui/Dialog.js

import React, { useEffect } from "react";
import styles from "../../styles/components/ui/Dialog.module.css";

const Dialog = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    console.log("Dialog mounted. isOpen:", isOpen);
  }, [isOpen]);

  if (!isOpen) return null; // Don't render if not open

  return (
    <div
      className={`${styles.dialogBackdrop} ${isOpen ? styles.show : styles.hide}`}
      onClick={onClose}
    >
      <div
        className={styles.dialogBox}
        onClick={(e) => e.stopPropagation()} // Prevents click on dialog box from closing
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.dialogContent}>{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
