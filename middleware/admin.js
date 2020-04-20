const jwt = require("jsonwebtoken");
const config = require("config");

// authorize the request by verifying auth-token
function admin(request, response, next) {
  const isAdminUser = request.user.isAdmin;
  // 401 Unausthorized
  // 403 Forbidden - don't try again you cannot access
  if (!isAdminUser)
    return response.status(403).send("Access Denied");
    next();
  /* try {
    request.user = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log('Authorised user');
    next();
  } catch (error) {
    return response.status(400).send("Invalid token.");
  } */
}
module.exports = admin;
