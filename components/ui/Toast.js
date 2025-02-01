import React, { useEffect } from "react";
import styles from "../../styles/components/ui/Toast.module.css"; // Ensure correct path

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>✖</button>
    </div>
  );
};

export default Toast;
