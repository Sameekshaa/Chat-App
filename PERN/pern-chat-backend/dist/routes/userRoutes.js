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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const router = require("express").Router();
const { knex } = require("../config/db/index");
const USER_TABLE_NAME = "users";
// creating user
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, picture } = req.body;
        console.log(req.body);
        const user = (yield knex(USER_TABLE_NAME)
            .insert({ name, email, password, picture })
            .returning("*"))[0];
        res.status(201).json(user);
    }
    catch (e) {
        let msg;
        if (e.code == 11000) {
            msg = "User already exists";
        }
        else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
}));
// login user
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield knex(USER_TABLE_NAME).where({ email, password }).first();
        console.log("login route:", user);
        if (!user) {
            throw new Error("User not found");
        }
        yield knex("users").where({ email }).update({ status: "online" });
        res.status(200).json(user);
    }
    catch (e) {
        console.log(e);
        res.status(400).json(e.message);
    }
}));
module.exports = router;
//# sourceMappingURL=userRoutes.js.map