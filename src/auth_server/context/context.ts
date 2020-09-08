import { Context } from "../interface";

export const context = ({ req }): Context => {
  const user = req.user;
  const error = req.error;

  return {
    user,
    error,
  };
};
