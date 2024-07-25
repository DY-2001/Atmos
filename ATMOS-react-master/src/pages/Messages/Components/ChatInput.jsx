import styles from "./ChatInput.module.css";

const ChatInput = () => {
  return (
    <div className={styles.chatInputContainer}>
      <input
        className={styles.chatInput}
        type="text"
        placeholder="Type a message . . ."
      />
      <div className={styles.chatButton}>
        <img
          style={{ width: "2rem", height: "2rem" }}
          src="./images/send.png"
        />
      </div>
    </div>
  );
};

export default ChatInput;
