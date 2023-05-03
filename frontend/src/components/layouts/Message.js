import React from "react";
import { useState } from "react";
import styles from "./Message.module.css";

const Message = () => {
  const [type, setType] = useState("");

  return (
    <div className={`${styles.message} ${styles[type]}`}>Minha mensagem</div>
  );
};

export default Message;
