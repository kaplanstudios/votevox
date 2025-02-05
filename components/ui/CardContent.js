import React from "react";
import styles from "../../styles/components/ui/CardContent.module.css";

const CardContent = ({ children, className }) => {
  return (
    <div className={`${styles["card-content"]} ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;
