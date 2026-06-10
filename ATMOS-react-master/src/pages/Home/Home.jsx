import React, { useState } from "react";
import Greeting from "./Greeting";
import RecentProject from "./RecentProject";
import Priority from "./Priority";
import { useEffect } from "react";
import Navbar_v2 from "../../UI/Navbar_v2";
import {
  Badge,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/getUserInfo",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();
      // console.log(data, 'data from home');
      if (data.success) {
        // console.log(data.user, 'from home');
        setUser(data.user);
        setMeetingRooms(data.user?.meetingRoomIdList || []);

        const token = localStorage.getItem("token");
        if (token) {
          const roomResponse = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/meeting/mine",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const roomData = await roomResponse.json();
          if (roomData.success) {
            const userRooms = data.user?.meetingRoomIdList || [];
            const fetchedRooms = roomData.rooms || [];
            const mergedRooms = [
              ...userRooms,
              ...fetchedRooms.filter(
                (room) =>
                  !userRooms.some(
                    (existingRoom) =>
                      existingRoom?._id?.toString() === room?._id?.toString(),
                  ),
              ),
            ];
            setMeetingRooms(mergedRooms);
          }
        }
      }
    };
    getUser();
  }, []);

  return (
    <>
      {user && <Navbar_v2 activeLink={"/home"} user={user} />}
      <Container fluid={true} bg={"#f8f9fa"} h={"93vh"}>
        <Center>{user && <Greeting user={user} />}</Center>
        <Center>
          <Paper
            radius="lg"
            p="lg"
            shadow="md"
            withBorder
            style={{
              width: "calc(100% - 48px)",
              marginBottom: 24,
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #2563eb 100%)",
              color: "white",
            }}
          >
            <Group position="apart" align="flex-start">
              <Stack spacing={6} style={{ maxWidth: 560 }}>
                <Badge
                  color="blue"
                  variant="filled"
                  size="lg"
                  sx={{ width: "fit-content" }}
                >
                  Meetings hub
                </Badge>
                <Title order={3}>
                  Rooms that you own or have been added to
                </Title>
                <Text size="sm" color="rgba(255,255,255,0.82)">
                  Create a room, invite teammates, and jump straight into a
                  video call from the same workspace.
                </Text>
              </Stack>
              <Button
                variant="white"
                color="dark"
                onClick={() => navigate("/meetings")}
              >
                Open meetings
              </Button>
            </Group>

            <Group mt="lg" spacing="sm">
              {meetingRooms.length > 0 ? (
                meetingRooms.slice(0, 4).map((room) => (
                  <Paper
                    key={room._id}
                    radius="md"
                    p="sm"
                    withBorder
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.12)",
                      minWidth: 180,
                    }}
                  >
                    <Text
                      size="l"
                      weight={600}
                      color="rgba(247, 214, 214, 0.72)"
                      lineClamp={1}
                    >
                      {room.roomName}
                    </Text>
                    <div style={{ marginBottom: "10px" }}>
                      <Text
                        size="xs"
                        color="rgba(255,255,255,0.72)"
                      >
                        #{room.roomCode}
                      </Text>
                    </div>

                    <Text size="sm" color="rgba(255,255,255,0.72)">
                      {room.members?.length || 0} members
                    </Text>
                  </Paper>
                ))
              ) : (
                <Text size="sm" color="rgba(255,255,255,0.72)">
                  No meeting rooms yet. Create one from the Meetings tab.
                </Text>
              )}
            </Group>
          </Paper>
        </Center>
        <Center>
          <Flex p={10} gap={120}>
            {user && <RecentProject user={user} />}
            {user && <Priority user={user} />}
          </Flex>
        </Center>
      </Container>
    </>
  );
};

export default Home;
