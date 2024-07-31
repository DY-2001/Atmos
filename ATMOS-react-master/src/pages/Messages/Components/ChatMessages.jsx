import { useEffect, useRef } from "react";
import styles from "./ChatMessages.module.css";

const ChatMessages = ({ messages, user }) => {
  const messagesEndRef = useRef(null);

  const convertToUserLocalTime = (date) => {
    const userLocalTime = new Date(date);
    return userLocalTime.toLocaleString();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatMessagesContainer}>
      <div className={styles.chatMessage}>
        {messages.map((message, index) => {
          const jsxElement =
            message.userId === user?._id ? (
              <div
                ref={messagesEndRef}
                key={index}
                className={`${styles.message} ${styles.myMessage}`}
              >
                <div className={styles.messageUser}>{message.userName}</div>
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {convertToUserLocalTime(message.createdAt)}
                </div>
              </div>
            ) : (
              <div key={index} className={styles.message} ref={messagesEndRef}>
                <div className={styles.messageUser}>{message.userName}</div>
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {convertToUserLocalTime(message.createdAt)}
                </div>
              </div>
            );
          return jsxElement;
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
