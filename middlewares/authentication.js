const { validateToken } = require('../services/authentication');
const User = require('../models/user'); // ✅ add this

function checkForAuthenticationCookie(cookieName) {
  
  return async (req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) {
      res.locals.user = null;
      return next();
    }

    try {
      const userPayload = validateToken(token); // just _id
      const user = await User.findById(userPayload._id); // 🧠 fetch full user

      if (!user) {
        res.locals.user = null;
        return next();
      }

      req.user = user;
      res.locals.user = user;

      console.log("✅ Authenticated user from DB:", user);

    } catch (error) {
      console.error("Invalid token:", error.message);
      res.clearCookie(cookieName);
      res.locals.user = null;
    }

    return next();
  };
}

module.exports = { checkForAuthenticationCookie };
