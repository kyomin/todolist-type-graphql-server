import * as bcrypt from "bcrypt";

import { saltRounds } from "../../../../config/security";

export class UserProxy {
  public static async encryptPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          console.log("genSalt 내에서 에러 : ", err);
          reject();
        }

        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            console.log("hash 내에서 에러 : ", err);
            reject();
          }
          resolve(hash);
        });
      });
    });
  }
}
