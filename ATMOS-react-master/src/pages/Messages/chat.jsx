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
};

const Chat = () => {
  const [user, setUser] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [allDMs, setAllDMs] = useState([]);
  const [tabSelected, setTabSelected] = useState(ITabSelected.GROUP);
  const [chatTabList, setChatTabList] = useState([]);
  const [chatBoxData, setChatBoxData] = useState(dummyData);

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
        // console.log("data", data)
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
      setChatTabList(newChatList);
    }
  }, [tabSelected, allProjects, allDMs]);

  return (
    <>
      {user && <Navbar_v2 activeLink={"/message"} user={user} />}
      <div className={styles.messageContainer}>
        <ChatSideBar
          tabSelected={tabSelected}
          setTabSelected={setTabSelected}
          chatTabList={chatTabList}
        />
        <ChatBox chatBoxData={chatBoxData} />
      </div>
    </>
  );
};

export default Chat;

// import { Container, Flex } from '@mantine/core';
// import { IconPhoto, IconMessageCircle } from '@tabler/icons-react';
// import {
//   Navbar,
//   useMantineTheme,
// } from '@mantine/core';
// import { Accordion } from '@mantine/core';
// import { Badge } from '@mantine/core';
// import { Tabs } from '@mantine/core';
// import Conversation from "./Conversation";
// import ProjectConversation from "./ProjectConcersation"
// import ChatBox from "./ChatBox";
// import ChatBoxP from "./ChatBoxP"

//   const [chats, setChats] = useState([]);
//   const [projectChats, setProjectChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const socket = useRef()
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [sendMessage, setSendMessage] = useState(null);
//   const [receiveMessage, setReceiveMessage] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);
//   const [allProjects, setAllProjects] = useState([]);
//   const [allIds, setAllIds] = useState([]);
//   const [existingIds, setExistingIds] = useState(null);

//   useEffect(() => {
//     async function getChats() {
//       try {
//         user && console.log("i sm", user)
//         const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/${user._id}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const data = await res.json();
//         setChats(data);
//         // console.log("Chats",data)
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     getChats();
//   }, [user]);

//   const getAllUsers = async () => {
//     try {
//       // console.log("i am here")
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getUserList`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await res.json();
//       console.log(data.userList)
//       setAllUsers(data.userList);
//       chats.forEach((ch) => {
//         const newUserChats = data.userList.filter(d => !ch.members.includes(d._id));
//         setExistingIds([...newUserChats])
//       })
//       data.userList && data.userList.map(async(users)=>{
//         if(users._id !== user.id){
//           const chat = {
//             senderId: user._id,
//             receiverId: users._id,
//           }
//           console.log("ch",chat)
//           const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/send`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${localStorage.getItem("token")}`,
//             },
//             body: JSON.stringify(chat)
//           });

//           const data = await res.json();
//           console.log(data)
//         }
//       })
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   useEffect(() => {
//     async function getProjectChats() {
//       try {
//         let projects = []
//         // allProjects && console.log("all",allProjects)
//         user && user.projectIdList.map(async(project)=>{
//           console.log(project)
//           const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/project/${project}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${localStorage.getItem("token")}`,
//             },
//           });
//           const data = await res.json();
//           // console.log("from",data)
//           projects.push(data[0])
//         })
//         setProjectChats(projects)

//       } catch (e) {
//         console.log(e);
//       }
//     }
//     getProjectChats();
//   }, [user]);

//   useEffect(() => {
//     socket.current = io(`${process.env.REACT_APP_SOCKET_URL}`);
//     user && socket.current.emit("new-user-add", user._id)
//     socket.current.on('get-users', (users) => {
//       setOnlineUsers(users);
//     })
//   }, [user])

//   // send message to socket
//   useEffect(() => {
//     if (sendMessage !== null) {
//       socket.current.emit('send-message', sendMessage)
//     }
//   }, [sendMessage])

//   // receive message from socket
//   useEffect(() => {
//     socket.current.on('recieve-message', (data) => {
//       console.log("data Received here")
//       setReceiveMessage(data)
//     })
//   }, [])

//   const checkOnlineStatus = (chat) => {
//     const chatMember = chat.members.find((member) => member !== user._id)
//     const online = onlineUsers.find((user) => user.userId === chatMember)
//     return online ? true : false
//   }

//   const theme = useMantineTheme();
//   const [opened, setOpened] = useState(false);
// return (
//       {user &&
//         <Container fluid={true} p={0} m={0} h={'100vh'}>
// {user && <Navbar_v2 activeLink={'/message'} user={user} />}
//           {
//             <Flex m={0} p={0} justify={'space-between'}>
//               <Flex width={'20%'} wrap="wrap">
//                 <Navbar p={0} m={0} hidden={!opened} grow>
//                   <Tabs defaultValue="gallery" m={0} p={0}>
//                     <Tabs.List>
//                       <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}> Projects</Tabs.Tab>
//                       <Tabs.Tab value="messages" icon={<IconMessageCircle size="0.8rem" onClick={() => {
//                         getAllUsers();
//                       }} />}>Direct Messages</Tabs.Tab>
//                     </Tabs.List>
//                     <Tabs.Panel value="gallery">
//                       <Accordion defaultValue="customization"
//                         chevron >
//                         {/* {console.log("cx",projectChats)} */}
//                         {user && projectChats.length>0 && projectChats.map((chat, index) => {
//                           // console.log("before print ", chat)
//                           return (
//                             <div key={index} onClick={() => {
//                               setCurrentChat(chat)

//                             }}>
//                               {<ProjectConversation chat={chat} currentUserId={user._id} />}
//                             </div>
//                           )
//                         })}
//                       </Accordion>
//                     </Tabs.Panel>

//                     <Tabs.Panel value="messages" style={{ overflow: "scroll", height: "80vh", scrollbarWidth: "0" }}>
//                       <Accordion defaultValue="customization" chevron>
//                         {user && chats && chats.map((chat) => {
//                           return (
//                             <div onClick={() => {
//                               setCurrentChat(chat)

//                             }}>
//                               <Conversation data={chat} currentUserId={user._id} online={checkOnlineStatus(chat)} />
//                             </div>
//                           )
//                         })}
//                       </Accordion>
//                     </Tabs.Panel>
//                   </Tabs>
//                 </Navbar>
//               </Flex>
//               <Flex direction={'column'} justify={'flex-end'} w={'60%'} >
//                 {user && currentChat && !currentChat.projectId && <ChatBox chat={currentChat} currentUserId={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage} />}
//                 {user && currentChat && currentChat.projectId && <ChatBoxP chat={currentChat} currentUserId={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage} />}
//               </Flex>
//               <Flex w={'20%'} direction={'column'}>

//                 {/* <MediaQuery smallerThan="sm" styles={{ display: 'none' }}> */}
//                 {/* <Aside hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}> */}
//                 {/* {user && currentChat && !currentChat.projectId && <ChatSidebar chat={currentChat} currentUserId={user._id} />} */}
//                 {user && currentChat && currentChat.projectId && <ChatSidebar chat={currentChat} currentUserId={user._id} />}
//                 {/* </Aside> */}
//                 {/* </MediaQuery> */}
//               </Flex>
//             </Flex>

//           }
//         </Container>
//       }
//   );
// };

// export default Chats;
