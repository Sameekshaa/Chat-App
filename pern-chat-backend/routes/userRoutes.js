const router = require("express").Router();
const { knex } = require("../config/db/index");

const USER_TABLE_NAME = "users";

// creating user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    console.log(req.body);
    const user = await knex(USER_TABLE_NAME)
      .insert({ name, email, password, picture })
      .returning("*");
    console.log(user);
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if (e.code == 11000) {
      msg = "User already exists";
    } else {
      msg = e.message;
    }
    console.log(e);
    res.status(400).json(msg);
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await knex(USER_TABLE_NAME).where({ email, password }).first();
    console.log("login route:", user);
    if (!user) {
      throw new Error("User not found");
    }
    await knex("users").where({ email }).update({ status: "online" });
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = router;
