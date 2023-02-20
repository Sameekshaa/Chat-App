require("dotenv").config();
// require("dotenv").config({ path: "../.env" });
console.log(
  "process.env.DATABASE_CONNECTION_STRING",
  process.env.DATABASE_CONNECTION_STRING
);

export default {
  client: "pg",
  connection: process.env.DATABASE_CONNECTION_STRING,
  useNullAsDefault: true,
};

