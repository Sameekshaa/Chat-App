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
/**
 * Learn TypeScript: Convert imports to es6
 */
const cors_1 = __importDefault(require("cors"));
const index_1 = require("../config/db/index");
const dotenv_1 = __importDefault(require("dotenv"));
/**
 * Learn TypeScript: Write type for constants
 */
const rooms = ["General", "Fullstack", "Data", "AI"];
dotenv_1.default.config();
//Use express middleware to handle request body in JSON and URL-encoded format
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
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
function getLastMessagesFromRoom(room) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield index_1.knex
            .select("messages.*", "users.name", "users.email", "users.picture")
            .from(MESSAGE_TABLE_NAME)
            .join("users", "messages.from", "=", "users.id")
            .where({ to: room })
            .orderBy("date", "asc");
    });
}
// Handle Socket.IO connection events
io.on("connection", (socket) => {
    // Handle a 'new-user' event by emitting the current members to all connected clients
    socket.on("new-user", () => __awaiter(void 0, void 0, void 0, function* () {
        const members = yield (0, index_1.knex)(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
        io.emit("new-user", members);
    }));
    // Handle a 'join-room' event by having the socket join the specified room and levaing the previous room
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
    // Handle a 'message-room' event by inserting the message into the database and emitting it to the specified room
    socket.on("message-room", (room, content, sender, time, date) => __awaiter(void 0, void 0, void 0, function* () {
        let newMessage = (yield (0, index_1.knex)(MESSAGE_TABLE_NAME)
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
        //Broadcasting the 'new-messages' event to all the rooms except current room. 
        socket.broadcast.to(room).emit("new-messages", newMessage);
        return;
    }));
    // Post request to handle Logout
    app.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("logout route body: ", req.body);
        try {
            const { id } = req.body;
            // Updating the status of the user who logs out
            yield (0, index_1.knex)(USER_TABLE_NAME).where({ id: id }).update({
                status: "offline",
            });
            const members = yield (0, index_1.knex)(USER_TABLE_NAME).select(`${USER_TABLE_NAME}.*`);
            // Broadcasting the status of users 
            socket.broadcast.emit("new-user", members);
            res.status(200).send();
        }
        catch (e) {
            console.log(e);
            res.status(400).send();
        }
    }));
});
//Get request to get rooms
app.get("/rooms", (req, res) => {
    res.json(rooms);
});
// Listening to specified port
server.listen(PORT, () => {
    console.log("listening to port", PORT);
});
//# sourceMappingURL=server.js.map