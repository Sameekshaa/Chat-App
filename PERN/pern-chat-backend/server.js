const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const rooms = [ "General", "Fullstack", "Data", "AI" ];
const cors = require("cors");
const {knex} = require("./config/db/index");

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

const USER_TABLE_NAME = "users";
const MESSAGE_TABLE_NAME = "messages";

const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
  cors : {
    origin : "http://localhost:3000",
    // origin: 'https://chat-app-backend-bwff.onrender.com',
    methods : [ "GET", "POST" ],
  },
});

async function getLastMessagesFromRoom(room) {
  return await knex
      .select("messages.*", "users.name", "users.email", "users.picture")
      .from(MESSAGE_TABLE_NAME)
      .join("users", "messages.from", "=", "users.id")
      .where({to : room})
      .orderBy("date", "asc");
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
    let roomMessages = (await getLastMessagesFromRoom(newRoom))
                           .map(({from, name, email, picture, ...message}) => ({
                                  ...message,
                                  from : {
                                    name,
                                    email,
                                    picture,
                                    id : from,
                                  },
                                }));
    console.log("roomMessages", roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    let newMessage = (await knex(MESSAGE_TABLE_NAME)
                          .insert({
                            content,
                            from : sender.id,
                            time,
                            date,
                            to : room,
                          })
                          .returning('*'))[0];

    newMessage.from = {
      id : sender.id,
      name : sender.name,
      email : sender.email,
      picture : sender.picture,
    };

    socket.broadcast.emit("new-messages", newMessage);
    console.log("newmsg", newMessage)

    // let roomMessages = await getLastMessagesFromRoom(room);
    // // // sending message to room
    // io.to(room).emit("room-messages", roomMessages);
    // socket.broadcast.emit("notifications", room);

    return;
  });

  app.post("/logout", async (req, res) => {
    console.log("logout route body: ", req.body);
    try {
      const {id} = req.body;
      await knex(USER_TABLE_NAME).where({id : id}).update({
        status : "offline",
      });
      // const members = await User.find();
      const members =
          await knex(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

app.get("/rooms", (req, res) => { res.json(rooms); });

server.listen(PORT, () => { console.log("listening to port", PORT); });

// unhandled promise rejetcion
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server  ");
  server.close(() => { process.exit(1); });
});
