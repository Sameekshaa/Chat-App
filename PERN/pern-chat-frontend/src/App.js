import "./App.css";

import { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation";
import { AppContext, socket } from "./context/appContext";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// App component
function App() {
  // State variables for managing chat rooms, members, messages,
  // privateMemberMsg etc.
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  // Get user data from the store
  const user = useSelector((state) => state.user);

  // This component uses the context API to provide state values to child
  // components
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
        newMessages,
        setNewMessages,
      }}
    >
      {" "}
      {/* App component is wrapped in a BrowserRouter for routing */}
      <BrowserRouter>
        {/* Rendered Navigation component for navigation */}
        <Navigation />
        {/* Routing is done using the Routes component */}
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<Home />} />
          {/* If the user is not logged in, the login and signup pages are available */}
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          {/* Route for the chat page */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>{" "}
    </AppContext.Provider>
  );
}

export default App;
