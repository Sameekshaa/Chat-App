const router = require("express").Router();
const { knex } = require("../config/db/index");

// Define the name of the user table in the database
const USER_TABLE_NAME = "users";

// Define the endpoint for handling POST requests
router.post("/", async (req, res) => {
  try {
    // Extract the user data from the request body
    const { name, email, password, picture } = req.body;

    // Insert a new user into the database and return the created user
    const user = (await knex(USER_TABLE_NAME)
      .insert({ name, email, password, picture })
      .returning("*"))[0];

    // Return the created user as a response with a 201 status code
    res.status(201).json(user);
  } catch (e) {
    // Declare a variable to store the error message
    let msg;

    // If the error is a duplicate key error
    if (e.code == 11000) {
      // Set the error message to "User already exists"
      msg = "User already exists";
    } else {
      // Set the error message to the exception's message
      msg = e.message;
    }

    // Log the error to the console
    console.log(e);

    // Return the error message with a 400 status code
    res.status(400).json(msg);
  }
});

// Define the endpoint for handling POST requests to the "/login" path
router.post("/login", async (req, res) => {
  try {
    // Extract the user's email and password from the request body
    const { email, password } = req.body;

    // Retrieve the user from the database with the matching email and password
    const user = await knex(USER_TABLE_NAME).where({ email, password }).first();

    // Log the retrieved user to the console
    console.log("login route:", user);

    // If the user is not found
    if (!user) {
      // Throw an error with the message "User not found"
      throw new Error("User not found");
    }

    // Update the user's status in the database to "online"
    await knex("users").where({ email }).update({ status: "online" });

    // Return the retrieved user as a response with a 200 status code
    res.status(200).json(user);
  } catch (e) {
    // Log the error to the console
    console.log(e);

    // Return the error message with a 400 status code
    res.status(400).json(e.message);
  }
});

// Export the router object
module.exports = router;