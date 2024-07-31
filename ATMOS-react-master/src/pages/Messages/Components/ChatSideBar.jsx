import { useState, useEffect } from "react";
import { ITabSelected } from "../Chat";
import styles from "./ChatSideBar.module.css";
import ChatList from "./ChatList";

const ChatSideBar = (props) => {
  const { tabSelected, setTabSelected, chatTabList, channel, setChannel } =
    props;

  return (
    <div className={styles.chatSideBarContainer}>
      <div className={styles.chatListContainer}>
        <div
          className={`${styles.tabContainer} ${
            tabSelected === ITabSelected.GROUP ? styles.selectedTab : ""
          }`}
          onClick={() => setTabSelected(ITabSelected.GROUP)}
        >
          Project Groups
        </div>
        {/* <div
          className={`${styles.tabContainer} ${
            tabSelected === ITabSelected.DM ? styles.selectedTab : ""
          }`}
          onClick={() => setTabSelected(ITabSelected.DM)}
        >
          Direct Message
        </div> */}
      </div>
      <ChatList
        chatTabList={chatTabList}
        channel={channel}
        setChannel={setChannel}
      />
    </div>
  );
};

export default ChatSideBar;
