import React, { useState, useEffect, useRef } from "react";
import Navbar_v2 from "../../UI/Navbar_v2";
import styles from "./Chat.module.css";
import ChatSideBar from "./Components/ChatSideBar";
import ChatBox from "./Components/ChatBox";

export const ITabSelected = {
  GROUP: "group",
  DM: "dm",
};

const dummyData = {
  type: ITabSelected.GROUP,
  name: "Project 1",
  members: [
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
    "user 8",
    "user 9",
    "user 10",
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
    "user 8",
    "user 9",
    "user 10",
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
    "user 8",
    "user 9",
    "user 10",
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
    "user 8",
    "user 9",
    "user 10",
  ],
  messages: [
    {
      userId: "User 1",
      userName:
        "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddU sdf sdfsdsd sd sd   sd sd   ser 1",
      content: "Hello World",
      time: "12:00",
    },
    {
      userId: "66a131ea8a8080ebc9a4dfaf",
      userName:
        "Udfsdf sf  sd fsdsersdf sdfsdfsdf sdfsdfs sdf sd sd sd sd sdfsdf sdfdf 1",
      content: "Hello World",
      time: "12:00",
    },
    {
      userId: "User 1",
      userName: "User 1",
      content: "He fsdfsdfsdfsdfsdfsdfsdf   dsf sd sds sllo World",
      time: "12:00",
    },
    {
      userId: "66a131ea8a8080ebc9a4dfaf",
      userName: "User 1",
      content:
        "He fsdfsdfsdfsdfsdfsdf  f sdf s fsd f dfsdf sd f sdf sdf sdf sdfsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfsdfsdf sdfsdfsdfllo World",
      time: "12:00",
    },
    {
      userId: "User 1",
      userName: "User 1",
      content:
        "Helfsdfsdfsdfasdfsdaf sdafs adfsdaf sfsf f s fsdf asd fa sd fasdfasf  dfsdf sdf sdf sdlo World",
      time: "12:00",
    },
    {
      userId: "User 1",
      userName: "User 1",
      content: "sfsdfsdfHello World",
      time: "12:00",
    },
    {
      userId: "User 1",
      userName: "User 1",
      content: "sdfasdHello World",
      time: "12:00",
    },
    {
      userId: "User 1",
      userName: "User 1",
      content: "sdfasdHello World",
      time: "12:00",
    },
    {
      userId: "66a131ea8a8080ebc9a4dfaf",
      userName: "User 1",
      content: "Heldsflo World",
      time: "12:00",
    },
    {
      userId: "User 1",
      userName: "User 1",
      content: "Hellofsd World",
      time: "12:00",
    },
  ],
};

const Chat = () => {
  const [user, setUser] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [allDMs, setAllDMs] = useState([]);
  const [tabSelected, setTabSelected] = useState(ITabSelected.GROUP);
  const [chatTabList, setChatTabList] = useState([]);
  const [chatBoxData, setChatBoxData] = useState(dummyData);
  const [channel, setChannel] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (channelId) => {
    //collect channel id which is chatid in database and 
    //set inputmessage in database and refetch the messages
  };

  useEffect(() => {
    setInputMessage("");
    //reset all when tabSelected or channel changes 
  }, [tabSelected, channel]);

  useEffect(() => {

  }, [])

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/getUserInfo`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/project/getUserProjects`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setAllProjects(data.projects);
      } catch (e) {
        console.log(e);
      }
    };
    getAllProjects();
  }, [tabSelected]);

  useEffect(() => {
    const getAllDMs = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/message/getAllDMs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setAllDMs(data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllDMs();
  }, [tabSelected]);

  useEffect(() => {
    if (tabSelected === ITabSelected.GROUP) {
      const newChatList = allProjects?.map((project) => {
        return {
          id: project._id,
          name: project.projectName,
        };
      });
      if (newChatList && newChatList.length > 0) {
        setChannel(newChatList[0]);
      }
      setChatTabList(newChatList);
    } else if (tabSelected === ITabSelected.DM) {
      const newChatList = allDMs
        ?.map((dm) => {
          return {
            id: dm._id,
            name: dm.userName,
          };
        })
        .filter((dm) => dm.id !== user._id);
      if (newChatList && newChatList.length > 0) {
        setChannel(newChatList[0]);
      }
      setChatTabList(newChatList);
    }
  }, [tabSelected, allProjects, allDMs]);

  useEffect(() => {
    if (!channel) {
      return;
    }

    //here channel means particular chatTabList element (project group or DM)
    // we will take id of channel which will match the ip of chatId in the database
    // then we will fetch the messages of that channel
    // and set the chatBoxData with the messages of that channel
  }, [channel]);

  return (
    <>
      {user && <Navbar_v2 activeLink={"/message"} user={user} />}
      <div className={styles.messageContainer}>
        <ChatSideBar
          tabSelected={tabSelected}
          setTabSelected={setTabSelected}
          chatTabList={chatTabList}
          channel={channel}
          setChannel={setChannel}
        />
        <ChatBox
          chatBoxData={chatBoxData}
          user={user}
          handleSendMessage={handleSendMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          channel={channel}
        />
      </div>
    </>
  );
};

export default Chat;
