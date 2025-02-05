import React from "react";
import styles from "../../styles/components/ui/Dialog.module.css";

const Dialog = ({ onClose, children, isFullScreen }) => {
  return (
    <div className={`${styles.dialogBackdrop} ${isFullScreen ? styles.dialogFullScreen : ""}`}>
      <div className={styles.dialogBox}>
        <div className={styles.dialogContent}>
          {children}
          <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
