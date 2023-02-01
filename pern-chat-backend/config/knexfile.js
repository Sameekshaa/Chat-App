require("dotenv").config();
console.log(process.env.DATABASE_CONNECTION_STRING)
module.exports = {
  client : "pg",
  connection : process.env.DATABASE_CONNECTION_STRING,
  useNullAsDefault : true,
};