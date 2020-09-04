import * as jwt from "jsonwebtoken";
import { logger } from "../../../config/winston";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) req.user = null;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.error(err);
      req.user = null;
    } else {
      req.user = user;
    }

    next();
  });
};
