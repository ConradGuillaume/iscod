const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "Token not provided";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);

    // Récupérer les informations complètes de l'utilisateur
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw "User not found";
    }

    req.user = user; // Attacher les informations complètes de l'utilisateur à req.user
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};