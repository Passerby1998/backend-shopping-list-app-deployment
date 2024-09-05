import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import database from "../database/connection.js";
dotenv.config();

async function isAuth(req, res, next) {
  const headers = req.headers;
  const token = headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // User validation
    const userQuery = `
      SELECT * FROM users WHERE id = $1 AND email = $2 AND username = $3
    `;
    const userRes = await database.query(userQuery, [
      decoded.id,
      decoded.email,
      decoded.username,
    ]);

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Assign req.user to decoded token values
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default isAuth;
