import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { User, Todo } from "../../entity";
import { UserService, TodoService } from "../../service";
import { RegisterInput, UserInfoOutput, LoginInput, LoginOutput } from "../../dto";
import { TodoStatus } from "../../enum";
import { CommonErrorInfo } from "../../../../error/CommonErrorInfo";

@Resolver((returnType) => UserInfoOutput)
export class UserResolver {
  @Query((returnType) => UserInfoOutput)
  async user(@Arg("id") id: number): Promise<UserInfoOutput> {
    const queryResult: UserInfoOutput | CommonErrorInfo = await UserService.findOneById(id);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

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

  @Mutation((returnType) => LoginOutput)
  async login(@Arg("loginInput") loginInput: LoginInput): Promise<LoginOutput> {
    const queryResult: LoginOutput | CommonErrorInfo = await UserService.login(loginInput.email, loginInput.password);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
