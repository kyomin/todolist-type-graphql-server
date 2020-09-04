import { AuthChecker } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import { CommonErrorCode } from "../../../error/CommonErrorCode";
import { Context } from "../interface";

export const authChecker: AuthChecker<Context> = async ({ context: { user } }, roles) => {
  if (!user) throw new ApolloError("인증에 실패했습니다.", CommonErrorCode.AUTHORIZATION_FAILED);

  return true;
};
