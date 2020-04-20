const jwt = require("jsonwebtoken");
const config = require("config");

// authorize the request by verifying auth-token
function auth(request, response, next) {
  const token = request.header("x-auth-token");
  if (!token)
    return response.status(401).send("Access denied. No token provided");

  try {
    request.user = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log('Authorised user');
    next();
  } catch (error) {
    return response.status(400).send("Invalid token.");
  }
}
module.exports = auth;
