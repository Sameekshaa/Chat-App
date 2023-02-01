const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const rooms = ["General", "Fullstack", "Data", "AI"];
const cors = require("cors");
const { default: knex } = require("knex");

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

// Message.aggregate
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a.id.split("/");
    let date2 = b.id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

// socket connection

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await knex(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
    io.emit("new-user", members);
  });

  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await knex(MESSAGE_TABLE_NAME).insert({
      content,
      from: sender,
      time,
      date,
      to: room,
    });

    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  app.delete("/logout", async (req, res) => {
    console.log(req.body);
    try {
      const { id, newMessages } = req.body;
      await knex(USER_TABLE_NAME).where({ id: id }).update({
        status: "offline",
        newMessages: newMessages,
      });
      // const members = await User.find();
      const members = await knex(USER_TABLE_NAME).select(
        `${USER_TABLE_NAME}.*`
      );
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

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
