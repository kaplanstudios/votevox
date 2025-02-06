import React, { useEffect } from "react";
import styles from "../../styles/components/ui/Dialog.module.css";

const Dialog = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    console.log("Dialog mounted. isOpen:", isOpen);
  }, [isOpen]);

  return (
    <div className={`${styles.dialogBackdrop} ${isOpen ? styles.show : styles.hide}`} onClick={onClose}>
      <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
