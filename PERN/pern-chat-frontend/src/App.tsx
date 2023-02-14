import "./App.css";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation";
import {
  AppContext,
  MessageType,
  PrivateMemberMsgType,
  socket,
} from "./context/appContext";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { SliceState } from "./features/userSlice";


function App() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [
    privateMemberMsg,
    setPrivateMemberMsg,
  ] = useState<PrivateMemberMsgType | null>(null);
  const user = useSelector((state: SliceState) => state.user);
  return (
    <AppContext.Provider
      value={{
        socket,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        rooms,
        setRooms,
      }}
    >
      {" "}
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>{" "}
    </AppContext.Provider>
  );
}

export default App;
