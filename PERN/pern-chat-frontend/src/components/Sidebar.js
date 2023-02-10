import "./Sidebar.css";

import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";

// Sidebar component
function Sidebar() {
  // Use the 'user' state from the Redux store
  const user = useSelector((state) => state.user);
  // console.log("user", user);
  const dispatch = useDispatch();

  // Context data from AppContext
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);

  // Function to join a room
  console.log("socket", socket); // socket connection
  // console.log("members", members);

  function joinRoom(room, isPublic = true) {
    // Checking if the user is logged in
    if (!user) {
      return alert("Please login");
    }
    // Emitting an event to join a room
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    // Setting the private member message to null
    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    // Dispatch for notifications
    dispatch(resetNotifications(room));
  }

  // Handling notifications
  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  // useEffect hook to join the General room when the user logs in
  useEffect(() => {
    if (user) {
      setCurrentRoom("General");
      getRooms();
      socket.emit("join-room", "General");
      socket.emit("new-user");
    }
  }, []);

  // Handling a new user joining the chat room
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  // Function to get the available rooms
  function getRooms() {
    // fetch("https://chat-app-backend-bwff.onrender.com/rooms")
    fetch(`${process.env.REACT_APP_BASE_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  // Utility function to order the room ids
  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  // Function to handle private member messages
  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user.id, member.id);
    joinRoom(roomId, false);
  }

  // Checking if the user is logged in, if not return an empty component
  if (!user) {
    return <></>;
  }

  // Rendering the sidebar component
  return (
    <>
      <h2>Available rooms</h2>

      {/* List available tooms */}
      <ListGroup>
        {" "}
        {rooms.map((room, idx) => (
          <ListGroup.Item
            key={idx}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {room}{" "}
            {currentRoom !== room && (
              <span className="badge rounded-pill bg-primary">
                {/* {user.newMessages[room]}  */}
              </span>
            )}
          </ListGroup.Item>
        ))}

      {/* List members */}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member) => (
        <ListGroup.Item
          key={member.id}
          style={{ cursor: "pointer" }}
          active={privateMemberMsg?.id === member?.id}
          onClick={() => handlePrivateMemberMsg(member)}
          disabled={member.id === user.id}
        >
          {" "}
          <Row>
            <Col xs={2} className="member-status">
              <img
                src={member.picture}
                className="member-status-img"
                alt="statusimg"
              />
              {member.status === "online" ? (
                <i className="fas fa-circle sidebar-online-status"></i>
              ) : (
                <i className="fas fa-circle sidebar-offline-status"></i>
              )}
            </Col>
            <Col xs={9}>
              {member.name}
              {member.id === user?.id && " (You)"}
              {member.status === "offline" && " (Offline)"}
            </Col>
            <Col xs={1}>
              <span className="badge rounded-pill bg-primary">
                {/* {user.newMessages[orderIds(member.id, user.id)]} */}
              </span>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </>
  );
}

export default Sidebar;
