import * as bcrypt from "bcrypt";

import { saltRounds } from "../../../../config/security";

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
}