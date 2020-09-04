import { Context } from "../interface";

export const context = ({ req }): Context => {
  const user = req.user;

  return {
    user,
  };
};
