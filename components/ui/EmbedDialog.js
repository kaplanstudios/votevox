import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/components/ui/EmbedDialog.module.css';

const EmbedDialog = ({ pollId, onClose }) => {
  const [embedLink, setEmbedLink] = useState(`${window.location.origin}/embed/${pollId}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedLink);
    alert("Embed link copied to clipboard!");
  };

  return (
    <div className={styles.dialogBackdrop} onClick={onClose}>
      <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>
        <h3>Embed Poll</h3>
        <input type="text" value={embedLink} readOnly className={styles.embedInput} />
        <div className={styles.dialogButtons}>
          <button onClick={handleCopy} className={styles.copyButton}>Copy</button>
          <button onClick={onClose} className={styles.doneButton}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default EmbedDialog;
