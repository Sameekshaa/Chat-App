const test = require("ava");
const express = require("express");
const app = express();
const rooms = ["General", "Fullstack", "Data", "AI"];
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server = require("http").createServer(app);

test.before(() => {
  server.listen(5001);
});

test.after.always(() => {
  server.close();
});

test("GET /rooms should return rooms", async (t) => {
  const res = await request(app).get("/rooms");
  // t.is(res.status, 200);
  t.deepEqual(res.body, rooms);
  console.log(res.body);
});
