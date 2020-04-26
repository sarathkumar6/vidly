const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("user model", () => {
  it("should generate a valid JWT token", () => {
    const adminUserInfo = {
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "J@hnd@e2020",
      isAdmin: false
    };
    const aUser = new User(adminUserInfo);
    const aUserAuthToken = aUser.generateAuthToken();
    const decoded = jwt.verify(aUserAuthToken, config.get("jwtPrivateKey"));
    const { _id, iat, isAdmin } = decoded;
    expect(typeof _id).toBe("string");
    expect(typeof iat).toBe("number");
    expect(isAdmin).toBe(false);
  });
});
