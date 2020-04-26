const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");
let server;
let getCustomerId;
let rental;
describe("api/vidly/returns", () => {
  beforeEach(async () => {
    server = require("../../index");
    rental = new Rental({
      customer: {
        name: "Sam Bortel",
        phone: "3223223222"
      },
      movie: {
        title: "The Way Back",
        dailyRentalDate: 2
      }
    });

    const savedRental = await rental.save();
    getCustomerId = _.get(savedRental, "customer._id");
  });

  afterEach(async () => {
    await Rental.remove({});
    await server.close();
  });

  describe("POST /", () => {
    let token;
    const noCustIdReturns = { movieId: "The Way Back" };
    const noMovieIdReturns = { customerId: "lol" };
    const validReturns = { customerId: "lol", movieId: "The Way Back" };
    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    async function execute(body) {
      return await request(server)
        .post("/api/vidly/returns")
        .set("x-auth-token", token)
        .send(body);
    }
    // Return 401 if client is not logged in
    it("should return 401 if the client is not logged in", async () => {
      const response = await request(server)
        .post("/api/vidly/returns")
        .set(noCustIdReturns);
      expect(response.status).toBe(401);
    });

    it("should return 400 if invalid customerId is passed", async () => {
      const response = await execute(noCustIdReturns);
      expect(response.status).toBe(400);
    });

    it("should return 400 if invalid movieId is passed", async () => {
      const response = await execute(noMovieIdReturns);
      expect(response.status).toBe(400);
    });

    // ToDo: Doesn't work - dot notation to get customer id and movie id through findOne not working
    /* it("should return 404 if invalid returns is passed", async () => {
      Rental.remove({});
      const response = await execute(validReturns);
      //        expect(response.status).toBe(404);
    }); */

    it("should return 400 if a return is already processed", async () => {
      rental.dateReturned = new Date();
      await rental.save();
      const response = await execute(validReturns);
    //ToDo: Not asserting proper error instead of rental processed
    // throws cast ObjectId error with customer id
      expect(response.status).toBe(400);
    });

    it("should return 200 if a valid return is passed", () => {
        
    });
  });
});
