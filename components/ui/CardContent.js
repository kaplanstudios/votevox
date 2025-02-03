import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "../../styles/components/ui/CardContent.module.css";

const CardContent = ({ children, className, isModal, onCancel, onSave }) => {
  const sigCanvasRef = useRef(null);

  const clearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  return (
    <div className={`${styles["card-content"]} ${className}`}>
      {children}
      {isModal && (
        <div className={styles.modalExtra}>
          <SignatureCanvas
            ref={sigCanvasRef}
            canvasProps={{ className: styles.signatureCanvas }}
          />
          <div className={styles.modalButtons}>
            <button className={styles.saveVoteButton} onClick={onSave}>
              Save Vote
            </button>
            <button className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContent;
