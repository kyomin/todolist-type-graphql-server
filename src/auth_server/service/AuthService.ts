import * as jwt from "jsonwebtoken";
import { Token } from "../entity";
import { UserTokenPayload } from "../interface";
import { CommonErrorInfo } from "../../../error/CommonErrorInfo";
import { CommonErrorCode } from "../../../error/CommonErrorCode";
import { logger } from "../../../config/winston";

export class AuthService {
  /* Exception Variables */
  private static loginException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 로그인에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static authException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.AUTHORIZATION_FAILED,
    "인증에 실패했습니다. 다시 로그인해 주십시오."
  );

  /* Business Method */
  public static async findOne(existingRefreshToken: string): Promise<Token> {
    return await Token.findOne({ refreshToken: existingRefreshToken });
  }

  public static async login(newRefreshToken: string): Promise<Token | CommonErrorInfo> {
    try {
      let newToken: Token = new Token();
      newToken.refreshToken = newRefreshToken;

      const createdTokenId: number = await (await Token.insert(newToken)).identifiers[0].id;
      newToken = await Token.findOne({ id: createdTokenId });
      if (!newToken) return this.loginException;

      return newToken;
    } catch (err) {
      logger.error(err);

      return this.loginException;
    }
  }

  public static async token(existingRefreshToken: string): Promise<string | CommonErrorInfo> {
    try {
      // refresh token을 저장한 테이블을 조회했는데 없다면 인증 실패이다.
      if (!(await this.findOne(existingRefreshToken))) return this.authException;

      let decodedUser: UserTokenPayload;

      await jwt.verify(existingRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) throw err;

        decodedUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      });

      return await jwt.sign(decodedUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    } catch (err) {
      logger.error(err);

      return this.authException;
    }
  }
}
