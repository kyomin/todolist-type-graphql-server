import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { saltRounds } from "../../../../config/security";
import { UserTokenPayload } from "../../interface";

export class UserProxy {
  public static async encryptPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) reject(err);

        bcrypt.hash(password, salt, function (err, hash) {
          if (err) reject(err);

          resolve(hash);
        });
      });
    });
  }

  public static async confirmPassword(plainPassword: string, encryptedPassword: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      bcrypt.compare(plainPassword, encryptedPassword, function (err, result) {
        if (err) reject(err);

        if (!result) resolve(false);

        resolve(true);
      });
    });
  }

  public static async generateAccessToken(payload: UserTokenPayload): Promise<string> {
    return await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
  }

  public static async generateRefreshToken(payload: UserTokenPayload): Promise<string> {
    return await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
  }
}
