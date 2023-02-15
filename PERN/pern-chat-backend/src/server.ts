import express, { Express, Request, Response } from "express";
const app: Express = express();
const userRoutes = require("../routes/userRoutes");

/**
 * Learn TypeScript: Convert imports to es6
 */
import cors from "cors";
import { knex } from "../config/db/index";
import dotenv from "dotenv";
import { LogoutUsers } from "../src/types/instance";

/**
 * Learn TypeScript: Write type for constants
 */
const rooms: string[] = ["General", "Fullstack", "Data", "AI"];

dotenv.config();
//Use express middleware to handle request body in JSON and URL-encoded format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//Mount the user routes at the '/user' endpoint
app.use("/users", userRoutes);
// Constants for the name of the user and message tables in the database
const USER_TABLE_NAME = "users";
const MESSAGE_TABLE_NAME = "messages";
// Create a HTTP server using express app as the request handler
const server = require("http").createServer(app);
const PORT = 5001;
//Attach a Socket.IO instance to the HTTP server
const io = require("socket.io")(server, {
  cors: {
    //Specify the allowed origin for incoming Websockets connection requests
    origin: `${process.env.SERVER_ORIGIN}`,
    methods: ["GET", "POST"],
  },
});

//Function to get the last messages from a specified room from the database
async function getLastMessagesFromRoom(room: string): Promise<any[]> {
  return await knex
    .select("messages.*", "users.name", "users.email", "users.picture")
    .from(MESSAGE_TABLE_NAME)
    .join("users", "messages.from", "=", "users.id")
    .where({ to: room })
    .orderBy("date", "asc");
}

// Handle Socket.IO connection events
io.on("connection", (socket: any) => {
  // Handle a 'new-user' event by emitting the current members to all connected clients
  socket.on("new-user", async () => {
    const members = await knex(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
    io.emit("new-user", members);
  });
  // Handle a 'join-room' event by having the socket join the specified room and levaing the previous room
  socket.on("join-room", async (newRoom: string, previousRoom: string) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = (await getLastMessagesFromRoom(newRoom)).map(
      ({ from, name, email, picture, ...message }) => ({
        ...message,
        from: {
          name,
          email,
          picture,
          id: from,
        },
      })
    );
    console.log("roomMessages", roomMessages);
    socket.emit("room-messages", roomMessages);
  });
  // Handle a 'message-room' event by inserting the message into the database and emitting it to the specified room
  socket.on(
    "message-room",
    async (
      room: string,
      content: string,
      sender: any,
      time: string,
      date: string
    ) => {
      let newMessage = (
        await knex(MESSAGE_TABLE_NAME)
          .insert({
            content,
            from: sender.id,
            time,
            date,
            to: room,
          })
          .returning("*")
      )[0];

      newMessage.from = {
        id: sender.id,
        name: sender.name,
        email: sender.email,
        picture: sender.picture,
      };

      //Broadcasting the 'new-messages' event to all the rooms except current room.
      socket.broadcast.to(room).emit("new-messages", newMessage);
      return;
    }
  );
  // Post request to handle Logout
  app.post("/logout", async (req: Request, res: Response) => {
    console.log("logout route body: ", req.body);
    try {
      const { id } = req.body as LogoutUsers;
      // Updating the status of the user who logs out
      await knex(USER_TABLE_NAME).where({ id: id }).update({
        status: "offline",
      });
      const members = await knex(USER_TABLE_NAME).select(
        `${USER_TABLE_NAME}.*`
      );
      // Broadcasting the status of users
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});
//Get request to get rooms
app.get("/rooms", (req: Request, res: Response) => {
  res.json(rooms);
});
// Listening to specified port
server.listen(PORT, () => {
  console.log("listening to port", PORT);
});
