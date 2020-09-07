import { Resolver, FieldResolver, Query, Mutation, Arg, Root, Authorized, Ctx, UseMiddleware } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { checkAdmin } from "../../middleware/checkAdmin";
import { User, Todo } from "../../entity";
import { UserService, TodoService } from "../../service";
import { RegisterInput, UserInfoOutput, LoginInput, LoginOutput } from "../../dto";
import { TodoStatus } from "../../enum";
import { CommonErrorInfo } from "../../../../error/CommonErrorInfo";
import { CommonErrorCode } from "../../../../error/CommonErrorCode";
import { Context } from "../../interface";

@Resolver((returnType) => UserInfoOutput)
export class UserResolver {
  // 해당 유저가 등록한 todo 정보를 가져온다.
  @FieldResolver((returnType) => [Todo!]!)
  async todos(
    @Root() user: UserInfoOutput,
    @Arg("status", (type) => TodoStatus, { nullable: true }) status?: TodoStatus,
    @Arg("cursor", { nullable: true }) cursor?: number
  ): Promise<Todo[]> {
    const { id } = user;
    let queryResult: Todo[] | CommonErrorInfo;

    if (!status) queryResult = await TodoService.findAllByUserId(id, cursor);
    else queryResult = await TodoService.findAllByUserIdAndStatus(id, status, cursor);

    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  /*
    관리자 권한으로 모든 회원들의 정보를 가져온다.
    추후 클라이언트의 관리자 user 페이지에서 회원 관리를 위함이다.
  */
  @Authorized()
  @UseMiddleware(checkAdmin)
  @Query((returnType) => [UserInfoOutput!]!)
  async allUsers(): Promise<UserInfoOutput[]> {
    const queryResult: UserInfoOutput[] | CommonErrorInfo = await UserService.findAll();
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  /*
    현재 로그인한 회원의 인증과 동시에 사용자 정보를 가져온다.
    @Authorized에 의해 authChecker 내에서 검증이 되고서 이곳에 진입하므로 context가 undefined일 경우는 없다.
  */
  @Authorized()
  @Query((returnType) => UserInfoOutput)
  async auth(@Ctx() context?: Context): Promise<UserInfoOutput> {
    const userId: number = context.user.id;

    const queryResult: UserInfoOutput | CommonErrorInfo = await UserService.findOneById(userId);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  // 회원등록(Create)
  @Mutation((returnType) => UserInfoOutput)
  async register(@Arg("registerInput") registerInput: RegisterInput): Promise<UserInfoOutput> {
    const newUser: User = new User();
    newUser.name = registerInput.name;
    newUser.password = registerInput.password;
    newUser.email = registerInput.email;

    const queryResult: UserInfoOutput | CommonErrorInfo = await UserService.register(newUser);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  // 로그인
  @Mutation((returnType) => LoginOutput)
  async login(@Arg("loginInput") loginInput: LoginInput): Promise<LoginOutput> {
    const queryResult: LoginOutput | CommonErrorInfo = await UserService.login(loginInput.email, loginInput.password);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  // 비밀번호 변경(Update)
  @Authorized()
  @Mutation((returnType) => UserInfoOutput)
  async updatePassword(@Arg("newPassword") newPassword: string, @Ctx() context?: Context): Promise<UserInfoOutput> {
    if (newPassword.length < 8)
      throw new ApolloError("패스워드가 너무 짧습니다. 8자 이상 입력해 주십시오.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newPassword.length > 100)
      throw new ApolloError("패스워드가 너무 깁니다. 20자 이내로 작성해 주십시오.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const userId: number = context.user.id;

    const queryResult: UserInfoOutput | CommonErrorInfo = await UserService.updatePassword(userId, newPassword);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
