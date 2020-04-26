const request = require("supertest");
const { Genre } = require("../../models/genre");
const _ = require("lodash");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/vidly/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  afterAll(() => server.close());

  async function addGenres() {
    Genre.collection.insertMany([
      { genreType: "Action", movies: ["MI 1", "MI 2", "MI 3"], genreId: "Act" },
      {
        genreType: "Sci-Fi",
        movies: ["Avatar 1", "Avatar 2", "Avatar 3"],
        genreId: "Sci"
      }
    ]);
  }
  describe("GET /", () => {
    it("should return all the genres", async () => {
      await addGenres();
      const response = await request(server).get("/api/vidly/genres");
      expect(response.status).toBe(200);
      expect(
        _.some(response.body, genre => {
          return genre.genreType === "Action";
        })
      ).toBe(true);
      expect(
        _.some(response.body, genre => {
          return genre.genreType === "Sci-Fi";
        })
      ).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("should return the genre if a valid genre id is passed", async () => {
      await addGenres();
      const actionGenreId = "Act";
      const response = await request(server).get(
        "/api/vidly/genres/" + actionGenreId
      );
      expect(response.status).toBe(200);
      expect(_.eq(_.get(response, "body.genreType"), "Action")).toBe(true);
    });

    it("should return 404 on invalid genre id", async () => {
      const actionGenreId = "Ac";
      const response = await request(server).get(
        "/api/vidly/genres/" + actionGenreId
      );
      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    const movies = ["Seven Pounds", "Fight Club", "Gone Girl"];
    const inValidGenre = { genreType: "Th", movies: movies };
    const validGenre = { genreType: "Thriller", movies: movies };
    beforeEach(() => {token = new User().generateAuthToken();});

    async function execute(body) {
      return await request(server)
        .post("/api/vidly/genres")
        .set("x-auth-token", token)
        .send(body);
    }

    it("should return 401 if the client is not logged in", async () => {
      const response = await request(server).post("/api/vidly/genres").set(inValidGenre);
      expect(response.status).toBe(401);
    });

    it("should return 400 if invalid genre is passed", async () => {
      const response = await execute(inValidGenre);
      expect(response.status).toBe(400);
    });

    it("should return 400 if invalid genre is passed", async () => {
      const response = await execute(inValidGenre);
      expect(response.status).toBe(400);
    });

    it("should add genre if valid genre is passed", async () => {
      const response = await execute(validGenre);
      expect(response.status).toBe(200);
      expect(mongoose.Types.ObjectId.isValid(response.body._id)).toBe(true);
      const findThrillerGenre = await Genre.findOne({ genreId: "Thr" });
      expect(mongoose.Types.ObjectId.isValid(response.body._id)).toBe(true);
    });
  });
});
