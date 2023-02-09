const test = require("ava");
const express = require("express");
const app = require();
const cors = require("cors");
const request = require('supertest');

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
  console.log(res)
  t.is(res.status, 200);
  t.deepEqual(res.body, rooms);
});
