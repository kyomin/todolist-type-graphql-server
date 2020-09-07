import { MiddlewareFn } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import { Context } from "../interface";
import { RoleStatus } from "../enum";
import { CommonErrorCode } from "../../../error/CommonErrorCode";

/*
    관리자인지를 체크하는 미들웨어 함수이다.
    이 미들웨어를 사용하는 쿼리 혹은 뮤테이션에 대해
    관리자가 아닌 사람이 접근하면 에러를 반환할 것이다.
    
    @UseMiddleware 데코를 통해 등록을 하며,
    authChecker 실행 후에 이 함수가 실행되므로,
    context에 담겨온 user 정보가 null일 경우는 없다.
*/
export const checkAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  const userRole: RoleStatus = context.user.role;

  if (userRole !== "ADMIN") throw new ApolloError("권한이 없는 사용자입니다.", CommonErrorCode.INVALID_ROLE);

  return next();
};
