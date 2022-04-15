const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized!" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ message: "Not authenticated!" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated!" });
  }
  req.user = decodedToken;
  next();
};
