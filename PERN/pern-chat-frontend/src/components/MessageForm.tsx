import "./MessageForm.css";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import { AppContext } from "../context/appContext";
import { SliceState, UserType } from "../features/userSlice";

function MessageForm() {
  const [message, setMessage] = useState("");
  const user = useSelector((state: SliceState) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  /**
   * Returns a formatted date string based on the given date.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string in the format of MM/DD/YYYY.
   */
  function getFormattedDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }
  // Function for scrolling at last message
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView();
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  socket.on("new-messages", (newMessage) => {
    setMessages([...messages, newMessage]);
  });

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;

    // const userId = user.id;
    socket.emit("message-room", roomId, message, user, time, todayDate);

    setMessages((current) => [
      ...current,
      {
        room: roomId,
        content: message,
        from: user as UserType,
        time: time,
        date: todayDate,
      },
    ]);

    setMessage("");
  }
  return (
    <>
      <div className="messages-output">
        {user && !privateMemberMsg?.id && (
          <div className="alert alert-info">
            You are in the {currentRoom} room
          </div>
        )}
        {user && privateMemberMsg?.id && (
          <>
            <div className="alert alert-info conversation-info">
              <div>
                Your conversation with {privateMemberMsg.name}{" "}
                <img
                  src={privateMemberMsg.picture}
                  className="conversation-profile-pic"
                  alt="privateMsg Pic"
                />
              </div>
            </div>
          </>
        )}
        {!user && <div className="alert alert-danger">Please login</div>}
        {user &&
          messages.map(({ date, content, time, from: sender }, idx) => {
            const hideDate = idx > 0 && date === messages[idx - 1].date;
            return (
              <div key={idx}>
                <>
                  {!hideDate && (
                    <p className="alert alert-info text-center message-date-indicator">
                      {date}
                    </p>
                  )}
                  {console.log("user", user.email)}
                  <div
                    className={
                      sender?.email === user?.email
                        ? "message"
                        : "incoming-message"
                    }
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={sender.picture}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                          alt="sender-pic"
                        />
                        <p className="message-sender">
                          {sender.id === user?.id ? "You" : sender.name}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                    </div>
                  </div>
                </>
              </div>
            );
          })}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;
