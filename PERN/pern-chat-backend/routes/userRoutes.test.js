const { userRoutes } = require("./userRoutes");
const { server } = require("../server");
const request = require("supertest");
const { knex } = require("../config/db/index");
const rooms = ["General", "Fullstack", "Data", "AI"];

// importing mock user data 
const { user } = require("./mockData");

afterAll(async () => {
  async () => {
    await server.close(() => {
      process.exit(1);
    });
  };
});

// Test for Register user.
describe("Register user", () => {
  afterEach(async () => {
    // clearing the test user from database after every test
    await knex("users").where("email", user.email).del();
    async () => {
      await server.close(() => {
        process.exit(1);
      });
    };
  });

  it("Returns 201 if user is inserted", async () => {
    // jest.setTimeout(10000)
    const res = await request("localhost:5001").post("/users").send(user);
    // console.log("respsone for register", res.body.name);
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe(user.name);
    expect(res.body.created_at).toBeTruthy();
    expect(res.body.updated_at).toBeTruthy();
  });

  it("Should save user to database", async () => {
    jest.setTimeout(10000);
    const res = await request("localhost:5001").post("/users").send(user);
    expect(res.body.name).toBe(user.name);
    expect(res.body.id).toBeTruthy();
    expect(res.body.created_at).toBeTruthy();
    expect(res.body.updated_at).toBeTruthy();
  });
});

// Test for Login user.
describe("Login User", () => {
  afterEach(async () => {
    // clearing the test user from database after every test
    await knex("users").where("email", user.email).del();
    async () => {
      await server.close(() => {
        process.exit(1);
      });
    };
  });

  it("should return status code 200 for userlogin", async () => {
    const res = await request("localhost:5001").post("/users").send(user);
    const login = {
      email: res.body.email,
      password: res.body.password,
    };
    const logUser = await request("localhost:5001")
      .post("/users/login")
      .send(login);
    expect(logUser.statusCode).toEqual(200);
    console.log("logUser body for login", logUser.body.id);
    expect(logUser.body.email).toBe(user.email);
  });
});

// Test for getting /rooms
describe("Get Rooms", () => {
  afterEach(async () => {
    async () => {
      await server.close(() => {
        process.exit(1);
      });
    };
  });

it("GET /rooms should return rooms", async () => {
  //   jest.setTimeout(10000);
  const res = await request("localhost:5001").get("/rooms");
  expect(res.statusCode).toEqual(200);
  console.log("res body", res.body);
  expect(res.body).toStrictEqual(rooms);
});
});