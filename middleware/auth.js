const jwt = require("jsonwebtoken");
const SECRET_KEY = "API";

const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    let user = jwt.verify(token, SECRET_KEY);
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
}

module.exports = auth;
