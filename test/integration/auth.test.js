const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;
describe("auth middleware", () => {
  let token;
  const movies = ["Seven Pounds", "Fight Club", "Gone Girl"];
  const validGenre = { genreType: "Thriller", movies: movies };
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });
  beforeEach(() => {token = new User().generateAuthToken();})

  async function execute(body) {
    return await request(server)
      .post("/api/vidly/genres")
      .set("x-auth-token", token)
      .send(body);
  }

  it("should return 401 if no token is provided", async () => {
    token = '';
    const response = await execute(validGenre);
    expect(response.status).toBe(401);
  });
});
