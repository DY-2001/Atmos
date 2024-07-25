import styles from "./ChatBox.module.css";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";

const ChatBox = (props) => {
  const { chatBoxData } = props;
  return (
    <div className={styles.chatBoxContainer}>
      <ChatBoxHeader chatBoxData={chatBoxData} />
      <ChatInput />
    </div>
  );
};

export default ChatBox;
