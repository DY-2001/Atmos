import styles from "./ChatBox.module.css";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const ChatBox = (props) => {
  const {
    chatBoxData,
    user,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    channel,
  } = props;
  const { channelMessages } = chatBoxData;

  return (
    <div className={styles.chatBoxContainer}>
      <ChatBoxHeader chatBoxData={chatBoxData} user={user} />
      {channelMessages?.length > 0 && <ChatMessages messages={channelMessages} user={user} />}
      <ChatInput
        handleSendMessage={handleSendMessage}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        channel={channel}
      />
    </div>
  );
};

export default ChatBox;
