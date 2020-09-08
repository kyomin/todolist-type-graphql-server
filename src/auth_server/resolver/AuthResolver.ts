import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import { Token } from "../entity";
import { AuthService } from "../service";
import { CommonErrorInfo } from "../../../error/CommonErrorInfo";
import { CommonErrorCode } from "../../../error/CommonErrorCode";
import { logger } from "../../../config/winston";

@Resolver(() => String)
export class AuthResolver {
  // 서버가 돌아가기 위한 임시 쿼리이다.
  @Query((returnType) => String)
  async authServerTest(): Promise<string> {
    return "Auth Server is running well";
  }

  // 로그인 시 발급되는 refresh token을 이 곳에서 저장해준다.
  @Mutation((returnType) => Token)
  async login(@Arg("newRefreshToken") newRefreshToken: string): Promise<Token> {
    const queryResult: Token | CommonErrorInfo = await AuthService.login(newRefreshToken);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  // access token이 만료된 경우 토큰 재발급을 해주는 곳이다.
  @Mutation((returnType) => String)
  async token(@Arg("existingRefreshToken") existingRefreshToken: string): Promise<string> {
    if (!existingRefreshToken) throw new ApolloError("다시 로그인해 주십시오.", CommonErrorCode.AUTHORIZATION_FAILED);

    const queryResult: string | CommonErrorInfo = await AuthService.token(existingRefreshToken);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
