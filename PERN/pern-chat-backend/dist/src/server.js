"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const userRoutes = require("../routes/userRoutes");
const rooms = ["General", "Fullstack", "Data", "AI"];
const cors = require("cors");
const { knex } = require("../config/db/index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors());
app.use("/users", userRoutes);
const USER_TABLE_NAME = "users";
const MESSAGE_TABLE_NAME = "messages";
const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
    cors: {
        origin: `${process.env.SERVER_ORIGIN}`,
        // origin: 'https://chat-app-backend-bwff.onrender.com',
        methods: ["GET", "POST"],
    },
});
function getLastMessagesFromRoom(room) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield knex
            .select("messages.*", "users.name", "users.email", "users.picture")
            .from(MESSAGE_TABLE_NAME)
            .join("users", "messages.from", "=", "users.id")
            .where({ to: room })
            .orderBy("date", "asc");
    });
}
// socket connection
io.on("connection", (socket) => {
    socket.on("new-user", () => __awaiter(void 0, void 0, void 0, function* () {
        const members = yield knex(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
        io.emit("new-user", members);
    }));
    socket.on("join-room", (newRoom, previousRoom) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = (yield getLastMessagesFromRoom(newRoom)).map((_a) => {
            var { from, name, email, picture } = _a, message = __rest(_a, ["from", "name", "email", "picture"]);
            return (Object.assign(Object.assign({}, message), { from: {
                    name,
                    email,
                    picture,
                    id: from,
                } }));
        });
        console.log("roomMessages", roomMessages);
        socket.emit("room-messages", roomMessages);
    }));
    socket.on("message-room", (room, content, sender, time, date) => __awaiter(void 0, void 0, void 0, function* () {
        let newMessage = (yield knex(MESSAGE_TABLE_NAME)
            .insert({
            content,
            from: sender.id,
            time,
            date,
            to: room,
        })
            .returning("*"))[0];
        newMessage.from = {
            id: sender.id,
            name: sender.name,
            email: sender.email,
            picture: sender.picture,
        };
        socket.broadcast.emit("new-messages", newMessage);
        console.log("newmsg", newMessage);
        // let roomMessages = await getLastMessagesFromRoom(room);
        // // // sending message to room
        // io.to(room).emit("room-messages", roomMessages);
        // socket.broadcast.emit("notifications", room);
        return;
    }));
    app.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("logout route body: ", req.body);
        try {
            const { id } = req.body;
            yield knex(USER_TABLE_NAME).where({ id: id }).update({
                status: "offline",
            });
            // const members = await User.find();
            const members = yield knex(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
            socket.broadcast.emit("new-user", members);
            res.status(200).send();
        }
        catch (e) {
            console.log(e);
            res.status(400).send();
        }
    }));
});
app.get("/rooms", (req, res) => {
    res.json(rooms);
});
server.listen(PORT, () => {
    console.log("listening to port", PORT);
});
//# sourceMappingURL=server.js.map