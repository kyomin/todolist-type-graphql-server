import * as jwt from "jsonwebtoken";
import { logger } from "../../../config/winston";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        logger.error(err);
        req.error = err;
      } else {
        req.user = user;
      }
    });
  }

  next();
};
