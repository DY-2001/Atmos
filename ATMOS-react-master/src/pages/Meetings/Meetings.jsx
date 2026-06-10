import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar_v2 from "../../UI/Navbar_v2";
import {
  Avatar,
  Badge,
  Button,
  createStyles,
  Divider,
  Group,
  Modal,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBrandZoom,
  IconCopy,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 45%, #e5eef8 100%)",
    paddingBottom: theme.spacing.xl,
  },
  hero: {
    margin: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #2563eb 100%)",
    color: "white",
    boxShadow: theme.shadows.lg,
  },
  sectionCard: {
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.md,
    border: "1px solid rgba(148, 163, 184, 0.2)",
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  roomsCard: {
    minHeight: 520,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  roomCard: {
    borderRadius: theme.radius.lg,
    border: "1px solid rgba(148, 163, 184, 0.2)",
    transition:
      "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows.md,
      borderColor: theme.colors.blue[4],
    },
  },
  roomsList: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    flex: 1,
    minHeight: 0,
    maxHeight: 410,
    overflowY: "auto",
    paddingRight: theme.spacing.xs,
  },
  content: {
    display: "flex",
    gap: theme.spacing.lg,
    alignItems: "stretch",
    padding: theme.spacing.md,
    flexWrap: "wrap",
  },
  leftPane: {
    flex: "1 1 360px",
    minWidth: 0,
  },
  rightPane: {
    flex: "2 1 560px",
    minWidth: 0,
  },
  activeRoomCard: {
    borderColor: theme.colors.blue[5],
    boxShadow: theme.shadows.md,
  },
  callFrame: {
    width: "100%",
    minHeight: 560,
    border: 0,
    borderRadius: theme.radius.lg,
    backgroundColor: "#000",
  },
  mutedText: {
    color: theme.colors.gray[6],
  },
}));

const getDisplayName = (member) => {
  return member?.userId?.userName || member?.userName || "Member";
};

const getAvatarSrc = (member) => {
  return member?.userId?.avatar || member?.avatar || null;
};

const Meetings = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createRoomOpened, { open: openCreateRoom, close: closeCreateRoom }] =
    useDisclosure(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const getUser = async () => {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/getUserInfo",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const getUsers = async () => {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/getUserList/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.userList || []);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const getRooms = async () => {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/meeting/mine",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("dushyantroom are", data);
      if (data.success) {
        setRooms(data.rooms);
      }
    };

    getRooms();
  }, [user]);

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.roomCode === roomCode) || null;
  }, [rooms, roomCode]);

  const availableInvitees = useMemo(() => {
    return allUsers
      .filter((candidate) => candidate._id !== user?._id)
      .map((candidate) => ({
        value: candidate._id,
        label: `${candidate.userName}${candidate.email ? ` (${candidate.email})` : ""}`,
      }));
  }, [allUsers, user]);

  const handleCreateRoom = async (event) => {
    event.preventDefault();

    if (!roomName.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setCreating(true);
    try {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/meeting/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomName,
            memberIds: selectedMembers,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        const createdRoom = data.room;
        setRooms((prevRooms) => [createdRoom, ...prevRooms]);
        setRoomName("");
        setSelectedMembers([]);
        closeCreateRoom();
        navigate(`/meetings/${createdRoom.roomCode}`);
      }
    } finally {
      setCreating(false);
    }
  };

  const copyInviteLink = async (room) => {
    const inviteLink = `${window.location.origin}/meetings/${room.roomCode}`;
    await navigator.clipboard.writeText(inviteLink);
  };

  const meetingSrc = selectedRoom
    ? `https://meet.jit.si/${selectedRoom.roomCode}`
    : null;

  return (
    <div className={classes.page}>
      {user && <Navbar_v2 activeLink="/meetings" user={user} />}

      <div className={classes.hero}>
        <Group position="apart" align="flex-start" noWrap>
          <Stack spacing={8} style={{ maxWidth: 700 }}>
            <Badge
              color="blue"
              variant="filled"
              size="lg"
              style={{ width: "fit-content" }}
            >
              Meetings
            </Badge>
            <Title order={2} style={{ color: "white" }}>
              Create rooms, invite teammates, and jump into a call.
            </Title>
            <Text color="rgba(255,255,255,0.78)">
              This workspace keeps meeting rooms alongside projects and notes so
              your team can move from planning to discussion without leaving
              Atmos.
            </Text>
          </Stack>
          <Stack align="flex-end" spacing="sm">
            <Badge
              variant="outline"
              color="gray"
              size="lg"
              style={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
            >
              {rooms.length} rooms available
            </Badge>
            <Button
              leftIcon={<IconBrandZoom size={16} />}
              color="dark"
              variant="white"
              onClick={openCreateRoom}
            >
              Create meeting room
            </Button>
          </Stack>
        </Group>
      </div>

      <Modal
        opened={createRoomOpened}
        onClose={closeCreateRoom}
        title="Create meeting room"
        centered
        radius="lg"
        size="lg"
      >
        <form onSubmit={handleCreateRoom}>
          <Stack spacing="md">
            <TextInput
              label="Room name"
              placeholder="Weekly planning sync"
              value={roomName}
              onChange={(event) => setRoomName(event.currentTarget.value)}
              required
            />
            <MultiSelect
              label="Invite teammates"
              placeholder="Select users"
              data={availableInvitees}
              value={selectedMembers}
              onChange={setSelectedMembers}
              searchable
              nothingFound="No other users found"
              clearable
            />
            <Group position="right">
              <Button variant="default" onClick={closeCreateRoom}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={creating}
                leftIcon={<IconUsers size={16} />}
              >
                Create room
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <div className={classes.content}>
        <div className={classes.leftPane}>
          <Paper
            className={`${classes.sectionCard} ${classes.roomsCard}`}
            p="lg"
            mt="lg"
            style={{ width: "100%" }}
          >
            <Group position="apart" mb="sm">
              <Title order={4}>Your rooms</Title>
              <Badge variant="light">{rooms.length}</Badge>
            </Group>
            <Stack
              spacing="sm"
              className={classes.roomsList}
              style={{ minHeight: 0 }}
            >
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  const isActive = room.roomCode === roomCode;
                  return (
                    <Paper
                      key={room._id}
                      p="md"
                      withBorder
                      className={`${classes.roomCard} ${isActive ? classes.activeRoomCard : ""}`}
                      onClick={() => navigate(`/meetings/${room.roomCode}`)}
                    >
                      <Group position="apart" align="flex-start" noWrap>
                        <div>
                          <Text weight={600}>{room.roomName}</Text>
                          <Text size="xs" className={classes.mutedText}>
                            #{room.roomCode}
                          </Text>
                        </div>
                        <Badge variant="light" color="blue">
                          {room.members?.length || 0}
                        </Badge>
                      </Group>
                      <Group spacing={6} mt="sm">
                        <Avatar.Group spacing="sm">
                          {(room.members || [])
                            .slice(0, 4)
                            .map((member, index) => (
                              <Avatar
                                key={`${room._id}-${index}`}
                                size={28}
                                radius="xl"
                                src={getAvatarSrc(member)}
                              >
                                {getDisplayName(member)
                                  .slice(0, 1)
                                  .toUpperCase()}
                              </Avatar>
                            ))}
                        </Avatar.Group>
                        {(room.members || []).length > 4 && (
                          <Text size="xs" className={classes.mutedText}>
                            +{room.members.length - 4} more
                          </Text>
                        )}
                      </Group>
                      <Group position="apart" mt="md">
                        <Text size="xs" className={classes.mutedText}>
                          Created by {room.createdBy?.userName || "you"}
                        </Text>
                        <Group spacing="xs">
                          <Button
                            variant="subtle"
                            size="xs"
                            leftIcon={<IconCopy size={14} />}
                            onClick={(event) => {
                              event.stopPropagation();
                              copyInviteLink(room);
                            }}
                          >
                            Copy link
                          </Button>
                          <Button
                            size="xs"
                            rightIcon={<IconArrowRight size={14} />}
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/meetings/${room.roomCode}`);
                            }}
                          >
                            Join
                          </Button>
                        </Group>
                      </Group>
                    </Paper>
                  );
                })
              ) : (
                <Text size="sm" className={classes.mutedText}>
                  No rooms yet. Create the first one from the form above.
                </Text>
              )}
            </Stack>
          </Paper>
        </div>

        <div className={classes.rightPane}>
          <Paper className={classes.sectionCard} p="lg" mt="lg">
            {selectedRoom ? (
              <Stack spacing="md">
                <Group position="apart" align="flex-start">
                  <div>
                    <Title order={3}>{selectedRoom.roomName}</Title>
                    <Text size="sm" className={classes.mutedText}>
                      Room code: {selectedRoom.roomCode}
                    </Text>
                  </div>
                  <Badge variant="light" color="teal">
                    Live room
                  </Badge>
                </Group>

                <Group position="apart" align="center">
                  <Group spacing="xs">
                    <IconUsers size={16} />
                    <Text size="sm">
                      {selectedRoom.members?.length || 0} members
                    </Text>
                  </Group>
                  <Button
                    variant="outline"
                    leftIcon={<IconCopy size={14} />}
                    onClick={() => copyInviteLink(selectedRoom)}
                  >
                    Copy invite link
                  </Button>
                </Group>

                <Divider />

                <iframe
                  title={selectedRoom.roomName}
                  className={classes.callFrame}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  src={meetingSrc}
                />

                <Text size="sm" className={classes.mutedText}>
                  If the embedded view is blocked by your browser, open the same
                  room URL in a new tab and keep the room code identical.
                </Text>

                <Group spacing="sm">
                  {(selectedRoom.members || []).map((member, index) => (
                    <Badge
                      key={`${selectedRoom._id}-member-${index}`}
                      variant="light"
                    >
                      {getDisplayName(member)}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            ) : (
              <Stack
                align="center"
                justify="center"
                spacing="md"
                style={{ minHeight: 560 }}
              >
                <IconVideo size={42} stroke={1.4} />
                <Title order={3}>Select a room to start the call</Title>
                <Text
                  size="sm"
                  className={classes.mutedText}
                  align="center"
                  maw={480}
                >
                  Pick an existing room from the list or create a new one on the
                  left. The live call will load here using the shared room code.
                </Text>
              </Stack>
            )}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
