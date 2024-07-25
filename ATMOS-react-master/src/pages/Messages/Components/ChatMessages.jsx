import styles from "./ChatMessages.module.css";

const ChatMessages = ({ messages, user }) => {
  console.log("ChatMessages -> messages dushyantisthead", messages, user);

  return (
    <div className={styles.chatMessagesContainer}>
      <div className={styles.chatMessage}>
        {messages.map((message, index) => {
          const jsxElement =
            message.userId === "66a131ea8a8080ebc9a4dfaf" ? (
              <div
                key={index}
                className={`${styles.message} ${styles.myMessage}`}
              >
                <div className={styles.messageUser}>{message.userName}</div>
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>{message.time}</div>
              </div>
            ) : (
              <div key={index} className={styles.message}>
                <div className={styles.messageUser}>{message.userName}</div>
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>{message.time}</div>
              </div>
            );
          return jsxElement;
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
