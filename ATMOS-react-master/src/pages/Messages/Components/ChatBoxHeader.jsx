import React, { useMemo } from "react";
import styles from "./ChatBoxHeader.module.css";
import { ITabSelected } from "../Chat";

const ChatBoxHeader = (props) => {
  const { chatBoxData } = props;

  const members = useMemo(() => {
    if (chatBoxData.type === ITabSelected.GROUP) {
      return chatBoxData.members.join(", ");
    }
    return "";
  }, [chatBoxData]);

  return (
    <div className={styles.chatBoxHeader}>
      {chatBoxData.type === ITabSelected.GROUP ? (
        <div className={styles.GroupBoxHeader}>
          <div className={styles.GroupName}>{chatBoxData.name}</div>
          <div className={styles.GroupMembers}>{members}</div>
        </div>
      ) : (
        <div className={styles.GroupBoxHeader}>
          <div className={styles.GroupName}>{chatBoxData.name}</div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxHeader;
