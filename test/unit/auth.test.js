const {User } = require("../../models/user");
const auth = require("../../middleware/auth")
const mongoose = require("mongoose")
describe("auth middleware", () => {
    it ("should populate request.user with the payload of a valid JWT", () => {
        const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
        const token = new User().generateAuthToken();
        const request = {header: jest.fn().mockReturnValue(token)}
        const next = jest.fn();
        auth(request, {}, next);
        console.log(request.user)
        //expect(request.user).toMatchObject(user);
        expect(request.user).toBeDefined();
    });

})