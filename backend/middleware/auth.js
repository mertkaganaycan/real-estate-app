const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ decode it first
    req.user = decoded;
    console.log("✅ Authenticated user ID:", decoded.id);      // ✅ log it after defining
    next();
  } catch (err) {
    console.log("Invalid token");
    res.status(401).json({ message: "Token is not valid" });
  }
};
