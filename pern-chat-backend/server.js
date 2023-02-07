const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const rooms = ["General", "Fullstack", "Data", "AI"];
const cors = require("cors");
const { knex } = require("./config/db/index");
// const { default: knex } = require("knex");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

const USER_TABLE_NAME = "users";
const MESSAGE_TABLE_NAME = "messages";

const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: 'https://chat-app-backend-bwff.onrender.com',
    methods: ["GET", "POST"],
  },
});
/**
 * Retrieves the last messages from a specified room in the database.
 *
 * @param {string} room - The room identifier to fetch messages from.
 * @returns {Array} An array of objects representing the messages in the room.
 */

async function getLastMessagesFromRoom(room) {
  return await knex
    .select()
    .from(MESSAGE_TABLE_NAME)
    .where({ to: room })
    .orderBy("date", "asc");
}

// socket connection
io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await knex(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
    io.emit("new-user", members);
  });

  //Handle join-room event
  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    console.log("roomMessages", roomMessages);
    socket.emit("room-messages", roomMessages);
  });
  //Insert the message into the messages table
  socket.on("message-room", async (room, content, sender, time, date) => {
    return await knex(MESSAGE_TABLE_NAME).insert({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    // roomMessages = sortRoomMessagesByDate(roomMessages);
    console.log("roomMessages", roomMessages);
    // Emit the room-messages event with the updated messages to the room clients
    io.to(room).emit("room-messages", roomMessages);
    // Broadcast the notifications event with the room name to all clients
    socket.broadcast.emit("notifications", room);
  });


  // Handle logout request 
  app.post("/logout", async (req, res) => {
    console.log("logout route body: ", req.body);
    try {
      // Extract the user ID from the request body
      const { id } = req.body;
      // Update the user's status to "offline in the database"
      await knex(USER_TABLE_NAME).where({ id: id }).update({
        status: "offline",
      });
      // Retrive the updated members list from the database
      const members = await knex(USER_TABLE_NAME).select(
        `${USER_TABLE_NAME}.*`
      );
      // Return a 200 status code to indicate success
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      // Log the error for debugging purpose
      console.log(e);
      // Return a 400 status code to indicate failure
      res.status(400).send();
    }
  });
});

//Get all the rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
});
// Listening to specified port
server.listen(PORT, () => {
  console.log("listening to port", PORT);
});

//unhandled promise rejetcion
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server  ");
  server.close(() => {
    process.exit(1);
  });
});
