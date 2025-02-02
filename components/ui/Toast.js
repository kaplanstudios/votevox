import React, { useEffect } from 'react';
import styles from '../../styles/components/ui/Toast.module.css';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onClose === 'function') {
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
}