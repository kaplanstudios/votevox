import React from 'react';
import '../../styles/components/Toast.module.css';

const Toast = ({ message, type }) => {
  return <div className={`toast toast-${type}`}>{message}</div>;
};

export default Toast;
