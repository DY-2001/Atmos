import styles from "./ChatBox.module.css";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const ChatBox = (props) => {
  const { chatBoxData, user } = props;
  const { messages } = chatBoxData;

  return (
    <div className={styles.chatBoxContainer}>
      <ChatBoxHeader chatBoxData={chatBoxData} />
      {messages.length > 0 && <ChatMessages messages={messages} user={user} />}
      <ChatInput />
    </div>
  );
};

export default ChatBox;
