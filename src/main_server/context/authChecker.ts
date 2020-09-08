import { AuthChecker } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { CommonErrorCode } from "../../../error/CommonErrorCode";
import { Context } from "../interface";

export const authChecker: AuthChecker<Context> = async ({ context: { user, error } }, roles) => {
  // error가 담겨왔고
  if (error) {
    // 만료된 토큰일 경우
    if (error instanceof TokenExpiredError)
      throw new ApolloError("자동 로그아웃 되었습니다. 다시 로그인 해주십시오.", CommonErrorCode.ACCESS_TOKEN_EXPIRED_ERROR);

    // 토큰의 형식이 맞지 않는 경우
    if (error instanceof JsonWebTokenError) throw new ApolloError("잘못된 요청입니다. 다시 로그인 해주십시오.", CommonErrorCode.JSON_WEB_TOKEN_ERROR);

    // 특정할 수 없는 에러의 경우
    throw new ApolloError("서버에 문제가 생겨 인증에 실패했습니다. 잠시 후 다시 시도해 주십시오.", CommonErrorCode.INTERNAL_SERVER_ERROR);
  }

  // user가 담기지 않았다면 token 없이 요청이 왔다는 소리이다.
  if (!user) throw new ApolloError("다시 로그인 해주십시오.", CommonErrorCode.AUTHORIZATION_FAILED);

  return true;
};
