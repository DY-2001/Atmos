import React, { useMemo } from "react";
import styles from "./ChatBoxHeader.module.css";
import { ITabSelected } from "../Chat";

const ChatBoxHeader = (props) => {
  const { chatBoxData, user } = props;

  const members = useMemo(() => {
    if (chatBoxData.channelType === ITabSelected.GROUP) {
      const memberNames = chatBoxData.channelMembers.map((member) => {
        if (member.userId === user?._id) {
          return `${member.userName} (You)`;
        }
        return member.userName;
      });
      return memberNames.join(", ");
    }
    return "";
  }, [chatBoxData]);

  return (
    <div className={styles.chatBoxHeader}>
      {chatBoxData.channelType === ITabSelected.GROUP ? (
        <div className={styles.GroupBoxHeader}>
          <div className={styles.GroupName}>{chatBoxData.channelName}</div>
          <div className={styles.GroupMembers}>{members}</div>
        </div>
      ) : (
        <div className={styles.GroupBoxHeader}>
          <div className={styles.GroupName}>{chatBoxData.channelName}</div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxHeader;
