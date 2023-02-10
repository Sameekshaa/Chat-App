import React from "react";
import { io } from "socket.io-client";
const SOCKET_URL = process.env.REACT_APP_BASE_URL;
// const SOCKET_URL = "https://chat-app-backend-bwff.onrender.com";
export const socket = io(SOCKET_URL);
// app context
export const AppContext = React.createContext();
