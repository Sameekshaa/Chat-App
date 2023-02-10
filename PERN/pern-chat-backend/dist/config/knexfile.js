require("dotenv").config();
// require("dotenv").config({ path: "../.env" });
console.log("process.env.DATABASE_CONNECTION_STRING", process.env.DATABASE_CONNECTION_STRING);
module.exports = {
    client: "pg",
    connection: process.env.DATABASE_CONNECTION_STRING,
    useNullAsDefault: true,
};
//# sourceMappingURL=knexfile.js.map