import styles from "./ChatInput.module.css";

const ChatInput = ({
  handleSendMessage,
  inputMessage,
  setInputMessage,
  channel,
}) => {
  return (
    <div className={styles.chatInputContainer}>
      <input
        className={styles.chatInput}
        type="text"
        placeholder="Type a message . . ."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <div onClick={() => handleSendMessage(channel?.id)} className={styles.chatButton}>
        <img
          style={{ width: "2rem", height: "2rem" }}
          src="./images/send.png"
        />
      </div>
    </div>
  );
};

export default ChatInput;
