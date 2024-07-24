import styles from "./ChatList.module.css";

const ChatList = (props) => {
  const { chatTabList } = props;
  return (
    <div className={styles.chatListContainer}>
      {chatTabList?.length > 0 ? (
        chatTabList.map((people, index) => (
          <div onClick={null} className={styles.messageTab}>
            <h1 className={styles.messageTabName}>{people.name}</h1>
          </div>
        ))
      ) : (
        <div className={styles.noChat}>
          <img
            style={{ width: "50px", height: "50px", marginBottom: "8px" }}
            src="./images/comments.png"
            alt="No Chat"
          />
          No Chat Available
        </div>
      )}
    </div>
  );
};

export default ChatList;
