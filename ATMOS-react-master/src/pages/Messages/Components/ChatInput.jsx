import styles from "./ChatInput.module.css";

const ChatInput = ({
  handleSendMessage,
  inputMessage,
  setInputMessage,
  channel,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage(channel?.id);
      }}
    >
      <div className={styles.chatInputContainer}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Type a message . . ."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className={styles.chatButton}>
          <img
            style={{ width: "2rem", height: "2rem" }}
            src="./images/send.png"
          />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
