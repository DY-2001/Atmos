import styles from "./ChatMessages.module.css";

const ChatMessages = ({ messages, user }) => {
  const convertToUserLocalTime = (date) => {
    const userLocalTime = new Date(date);
    return userLocalTime.toLocaleString();
  };

  return (
    <div className={styles.chatMessagesContainer}>
      <div className={styles.chatMessage}>
        {messages.map((message, index) => {
          const jsxElement =
            message.userId === user._id ? (
              <div
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
              <div key={index} className={styles.message}>
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
