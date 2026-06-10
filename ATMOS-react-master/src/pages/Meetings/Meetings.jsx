import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar_v2 from "../../UI/Navbar_v2";
import socketInit from "../../socket";
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
  IconCopy,
  IconMicrophone,
  IconMicrophoneOff,
  IconUsers,
  IconVideo,
  IconVideoOff,
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
  callStage: {
    width: "100%",
    minHeight: 560,
    borderRadius: theme.radius.lg,
    backgroundColor: "#0f172a",
    padding: theme.spacing.md,
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: theme.spacing.md,
    flex: 1,
  },
  videoTile: {
    position: "relative",
    minHeight: 220,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    backgroundColor: "#020617",
    border: "1px solid rgba(148, 163, 184, 0.24)",
  },
  emptyVideoTile: {
    position: "relative",
    minHeight: 220,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    border: "1px solid rgba(147, 197, 253, 0.34)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
  },
  tileTone0: {
    background:
      "linear-gradient(135deg, #dbeafe 0%, #60a5fa 52%, #1d4ed8 100%)",
  },
  tileTone1: {
    background:
      "linear-gradient(135deg, #eff6ff 0%, #93c5fd 45%, #2563eb 100%)",
  },
  tileTone2: {
    background:
      "linear-gradient(135deg, #bfdbfe 0%, #3b82f6 48%, #1e3a8a 100%)",
  },
  tileTone3: {
    background:
      "linear-gradient(135deg, #e0f2fe 0%, #38bdf8 45%, #1d4ed8 100%)",
  },
  emptyTileContent: {
    minHeight: 220,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: theme.spacing.sm,
    color: "white",
  },
  participantInitials: {
    width: 76,
    height: 76,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.26)",
    border: "1px solid rgba(255,255,255,0.45)",
    fontSize: 26,
    fontWeight: 800,
  },
  video: {
    width: "100%",
    height: "100%",
    minHeight: 220,
    objectFit: "cover",
    display: "block",
  },
  videoLabel: {
    position: "absolute",
    left: theme.spacing.sm,
    bottom: theme.spacing.sm,
    padding: "4px 8px",
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(15, 23, 42, 0.74)",
    color: "white",
    fontSize: theme.fontSizes.xs,
    fontWeight: 600,
  },
  mediaBadges: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    display: "flex",
    gap: 6,
  },
  mediaBadge: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backgroundColor: "rgba(238, 31, 31, 0.88)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  mediaBadgeButton: {
    cursor: "pointer",
    transition: "transform 120ms ease, filter 120ms ease",
    "&:hover": {
      transform: "translateY(-1px)",
      filter: "brightness(1.08)",
    },
  },
  mediaBadgeOff: {
    backgroundColor: "rgba(153, 27, 27, 0.92)",
  },
  callPlaceholder: {
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "rgba(255,255,255,0.72)",
    border: "1px dashed rgba(148, 163, 184, 0.4)",
    borderRadius: theme.radius.md,
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

const getInitials = (name = "User") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const MediaStatusBadges = ({
  audio,
  video,
  classes,
  onToggleAudio,
  onToggleVideo,
}) => {
  const audioEnabled = Boolean(audio);
  const videoEnabled = Boolean(video);
  const AudioBadgeElement = onToggleAudio ? "button" : "div";
  const VideoBadgeElement = onToggleVideo ? "button" : "div";

  return (
    <div className={classes.mediaBadges}>
      <AudioBadgeElement
        type={onToggleAudio ? "button" : undefined}
        className={`${classes.mediaBadge} ${
          audioEnabled ? "" : classes.mediaBadgeOff
        } ${onToggleAudio ? classes.mediaBadgeButton : ""}`}
        title={audioEnabled ? "Turn microphone off" : "Turn microphone on"}
        onClick={onToggleAudio}
      >
        {audioEnabled ? (
          <IconMicrophone size={15} />
        ) : (
          <IconMicrophoneOff size={15} />
        )}
      </AudioBadgeElement>
      <VideoBadgeElement
        type={onToggleVideo ? "button" : undefined}
        className={`${classes.mediaBadge} ${
          videoEnabled ? "" : classes.mediaBadgeOff
        } ${onToggleVideo ? classes.mediaBadgeButton : ""}`}
        title={videoEnabled ? "Turn camera off" : "Turn camera on"}
        onClick={onToggleVideo}
      >
        {videoEnabled ? <IconVideo size={15} /> : <IconVideoOff size={15} />}
      </VideoBadgeElement>
    </div>
  );
};

const VideoTile = ({
  stream,
  label,
  muted = false,
  className,
  videoClassName,
  labelClassName,
  children,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        className={videoClassName}
        autoPlay
        playsInline
        muted={muted}
      />
      <div className={labelClassName}>{label}</div>
      {children}
    </div>
  );
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
  const [localStream, setLocalStream] = useState(null);
  const [remoteVideos, setRemoteVideos] = useState([]);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [callError, setCallError] = useState("");
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map());
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

  const closePeerConnection = useCallback((socketId) => {
    const peer = peersRef.current.get(socketId);
    if (peer) {
      peer.close();
      peersRef.current.delete(socketId);
    }

    setRemoteVideos((prevVideos) =>
      prevVideos.filter((video) => video.socketId !== socketId),
    );
    setRemoteParticipants((prevParticipants) =>
      prevParticipants.filter(
        (participant) => participant.socketId !== socketId,
      ),
    );
  }, []);

  const upsertRemoteParticipant = useCallback((participant) => {
    if (!participant?.socketId) return;

    setRemoteParticipants((prevParticipants) => {
      const exists = prevParticipants.some(
        (currentParticipant) =>
          currentParticipant.socketId === participant.socketId,
      );

      return exists
        ? prevParticipants.map((currentParticipant) =>
            currentParticipant.socketId === participant.socketId
              ? { ...currentParticipant, ...participant }
              : currentParticipant,
          )
        : [...prevParticipants, participant];
    });
  }, []);

  const createPeerConnection = useCallback(
    (participant) => {
      const existingPeer = peersRef.current.get(participant.socketId);
      if (existingPeer) return existingPeer;

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      const localTracks = localStreamRef.current?.getTracks() || [];
      localTracks.forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      if (localTracks.length === 0) {
        peerConnection.addTransceiver("video", { direction: "recvonly" });
        peerConnection.addTransceiver("audio", { direction: "recvonly" });
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("meeting:ice-candidate", {
            to: participant.socketId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        const [stream] = event.streams;
        if (!stream) return;

        setRemoteVideos((prevVideos) => {
          const nextVideo = {
            socketId: participant.socketId,
            user: participant.user,
            stream,
          };
          const exists = prevVideos.some(
            (video) => video.socketId === participant.socketId,
          );

          return exists
            ? prevVideos.map((video) =>
                video.socketId === participant.socketId ? nextVideo : video,
              )
            : [...prevVideos, nextVideo];
        });
      };

      peerConnection.onconnectionstatechange = () => {
        if (
          ["closed", "disconnected", "failed"].includes(
            peerConnection.connectionState,
          )
        ) {
          closePeerConnection(participant.socketId);
        }
      };

      peersRef.current.set(participant.socketId, peerConnection);
      upsertRemoteParticipant(participant);
      return peerConnection;
    },
    [closePeerConnection, upsertRemoteParticipant],
  );

  useEffect(() => {
    if (!selectedRoom || !user) return undefined;

    let isMounted = true;
    const socket = socketInit();
    const peerConnections = peersRef.current;
    socketRef.current = socket;
    setRemoteVideos([]);
    setRemoteParticipants([]);
    setCallError("");

    const startMeeting = async () => {
      // const TEST_WITHOUT_MEDIA = true;
      try {
        // if (TEST_WITHOUT_MEDIA) {
        //   const emptyStream = new MediaStream();

        //   localStreamRef.current = emptyStream;
        //   setLocalStream(emptyStream);
        //   setIsAudioOn(false);
        //   setIsVideoOn(false);

        //   socket.emit("meeting:join", {
        //     roomCode: selectedRoom.roomCode,
        //     user,
        //   });
        //   socket.emit("meeting:media-state", {
        //     audio: false,
        //     video: false,
        //   });

        //   return;
        // }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        setIsAudioOn(true);
        setIsVideoOn(true);
        socket.emit("meeting:join", {
          roomCode: selectedRoom.roomCode,
          user,
        });
        socket.emit("meeting:media-state", {
          audio: true,
          video: true,
        });
      } catch (error) {
        setCallError(
          "Camera or microphone access was blocked. Allow permissions and re-open this room.",
        );
      }
    };

    const handleParticipants = ({ participants }) => {
      setRemoteParticipants(participants || []);
    };

    const handleUserJoined = async (participant) => {
      upsertRemoteParticipant(participant);
      const peerConnection = createPeerConnection(participant);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("meeting:offer", {
        to: participant.socketId,
        offer,
      });
    };

    const handleOffer = async ({ from, fromUser, offer }) => {
      upsertRemoteParticipant({
        socketId: from,
        user: fromUser || { userName: "Teammate" },
      });
      const peerConnection = createPeerConnection({
        socketId: from,
        user: fromUser || { userName: "Teammate" },
      });
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("meeting:answer", {
        to: from,
        answer,
      });
    };

    const handleAnswer = async ({ from, answer }) => {
      const peerConnection = peersRef.current.get(from);
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    };

    const handleIceCandidate = async ({ from, candidate }) => {
      const peerConnection = peersRef.current.get(from);
      if (!peerConnection || !candidate) return;

      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const handleUserLeft = ({ socketId }) => {
      closePeerConnection(socketId);
    };

    const handleMediaState = ({ socketId, mediaState }) => {
      setRemoteParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.socketId === socketId
            ? { ...participant, mediaState }
            : participant,
        ),
      );
    };

    socket.on("meeting:participants", handleParticipants);
    socket.on("meeting:user-joined", handleUserJoined);
    socket.on("meeting:offer", handleOffer);
    socket.on("meeting:answer", handleAnswer);
    socket.on("meeting:ice-candidate", handleIceCandidate);
    socket.on("meeting:user-left", handleUserLeft);
    socket.on("meeting:media-state", handleMediaState);

    startMeeting();

    return () => {
      isMounted = false;
      socket.emit("meeting:leave");
      socket.disconnect();
      socketRef.current = null;

      peerConnections.forEach((peerConnection) => peerConnection.close());
      peerConnections.clear();
      setRemoteVideos([]);
      setRemoteParticipants([]);

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    };
  }, [
    closePeerConnection,
    createPeerConnection,
    selectedRoom,
    upsertRemoteParticipant,
    user,
  ]);

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

  const toggleAudio = () => {
    const audioTracks = localStreamRef.current?.getAudioTracks() || [];
    if (audioTracks.length === 0) return;

    const nextAudioState = !isAudioOn;
    audioTracks.forEach((track) => {
      track.enabled = nextAudioState;
    });
    socketRef.current?.emit("meeting:media-state", {
      audio: nextAudioState,
      video: isVideoOn,
    });
    setIsAudioOn(nextAudioState);
  };

  const toggleVideo = () => {
    const videoTracks = localStreamRef.current?.getVideoTracks() || [];
    if (videoTracks.length === 0) return;

    const nextVideoState = !isVideoOn;
    videoTracks.forEach((track) => {
      track.enabled = nextVideoState;
    });
    socketRef.current?.emit("meeting:media-state", {
      audio: isAudioOn,
      video: nextVideoState,
    });
    setIsVideoOn(nextVideoState);
  };

  const remoteTiles = useMemo(() => {
    return remoteParticipants.map((participant, index) => {
      const remoteVideo = remoteVideos.find(
        (video) => video.socketId === participant.socketId,
      );

      return {
        ...participant,
        stream: remoteVideo?.stream || null,
        user: remoteVideo?.user || participant.user,
        toneIndex: index % 4,
      };
    });
  }, [remoteParticipants, remoteVideos]);

  const localHasVideo = useMemo(() => {
    return (
      isVideoOn &&
      Boolean(
        localStream
          ?.getVideoTracks()
          .some((track) => track.readyState === "live" && track.enabled),
      )
    );
  }, [isVideoOn, localStream]);

  const localCanToggleAudio = useMemo(() => {
    return Boolean(localStream?.getAudioTracks().length);
  }, [localStream]);

  const localCanToggleVideo = useMemo(() => {
    return Boolean(localStream?.getVideoTracks().length);
  }, [localStream]);

  const leaveCall = () => {
    socketRef.current?.emit("meeting:leave");

    peersRef.current.forEach((peer) => peer.close());
    peersRef.current.clear();

    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteVideos([]);
    setRemoteParticipants([]);

    navigate("/meetings");
  };

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
              leftIcon={<IconVideo size={16} />}
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
                          {room.members?.length || 0} members
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
                            // styles={{padding: "6px 20px"}}
                            // rightIcon={<IconArrowRight size={14} />}
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

                  <Group spacing={6}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        boxShadow: "0 0 8px #22c55e",
                        animation: "pulse 1.5s infinite",
                      }}
                      className={classes.liveDot}
                    />
                    <Text color="teal" weight={600}>
                      Live Room
                    </Text>
                  </Group>
                </Group>

                <Group position="apart" align="center">
                  <Group spacing="xs">
                    <IconUsers size={16} />
                    <Text size="sm">
                      {remoteParticipants.length + 1} people joined
                    </Text>
                  </Group>
                  {/* <Button
                    variant="outline"
                    leftIcon={<IconCopy size={14} />}
                    onClick={() => copyInviteLink(selectedRoom)}
                  >
                    Copy invite link
                  </Button> */}
                  <Button color="red" onClick={leaveCall}>
                    Leave Call
                  </Button>
                </Group>

                <Divider />

                <div className={classes.callStage}>
                  {callError ? (
                    <div className={classes.callPlaceholder}>{callError}</div>
                  ) : (
                    <div className={classes.videoGrid}>
                      {localStream && localHasVideo ? (
                        <VideoTile
                          stream={localStream}
                          label={`${user?.userName || "You"} (you)`}
                          muted
                          className={classes.videoTile}
                          videoClassName={classes.video}
                          labelClassName={classes.videoLabel}
                        >
                          <MediaStatusBadges
                            audio={isAudioOn}
                            video={isVideoOn}
                            classes={classes}
                            onToggleAudio={
                              localCanToggleAudio ? toggleAudio : undefined
                            }
                            onToggleVideo={
                              localCanToggleVideo ? toggleVideo : undefined
                            }
                          />
                        </VideoTile>
                      ) : localStream ? (
                        <div
                          className={`${classes.emptyVideoTile} ${classes.tileTone0}`}
                        >
                          <div className={classes.emptyTileContent}>
                            <div className={classes.participantInitials}>
                              {getInitials(user?.userName || "You")}
                            </div>
                          </div>
                          <div className={classes.videoLabel}>
                            {`${user?.userName || "You"} (you)`}
                          </div>
                          <MediaStatusBadges
                            audio={isAudioOn}
                            video={isVideoOn}
                            classes={classes}
                            onToggleAudio={
                              localCanToggleAudio ? toggleAudio : undefined
                            }
                            onToggleVideo={
                              localCanToggleVideo ? toggleVideo : undefined
                            }
                          />
                        </div>
                      ) : (
                        <div className={classes.callPlaceholder}>
                          Starting camera and microphone...
                        </div>
                      )}

                      {remoteTiles.map((remoteTile) =>
                        remoteTile.stream ? (
                          <VideoTile
                            key={remoteTile.socketId}
                            stream={remoteTile.stream}
                            label={remoteTile.user?.userName || "Teammate"}
                            className={classes.videoTile}
                            videoClassName={classes.video}
                            labelClassName={classes.videoLabel}
                          >
                            <MediaStatusBadges
                              audio={remoteTile.mediaState?.audio}
                              video={remoteTile.mediaState?.video}
                              classes={classes}
                            />
                          </VideoTile>
                        ) : (
                          <div
                            key={remoteTile.socketId}
                            className={`${classes.emptyVideoTile} ${
                              classes[`tileTone${remoteTile.toneIndex || 0}`]
                            }`}
                          >
                            <div className={classes.emptyTileContent}>
                              <div className={classes.participantInitials}>
                                {getInitials(
                                  remoteTile.user?.userName || "Teammate",
                                )}
                              </div>
                            </div>
                            <div className={classes.videoLabel}>
                              {remoteTile.user?.userName || "Teammate"}
                            </div>
                            <MediaStatusBadges
                              audio={remoteTile.mediaState?.audio}
                              video={remoteTile.mediaState?.video}
                              classes={classes}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
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
