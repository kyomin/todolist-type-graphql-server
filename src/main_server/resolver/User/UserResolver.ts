import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { User, Todo } from "../../entity";
import { UserService, TodoService } from "../../service";
import { RegisterInput } from "../../dto";
import { RegisterOutput } from "../../dto";
import { TodoStatus } from "../../enum";
import { ErrorInfo } from "../../../../error/ErrorInfo";

@Resolver((returnType) => User)
export class UserResolver {
  @Query((returnType) => User)
  async user(@Arg("id") id: number): Promise<User> {
    let queryResult: User | ErrorInfo = await UserService.findOneById(id);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @FieldResolver((returnType) => [Todo!]!)
  async todos(
    @Root() user: User,
    @Arg("status", (type) => TodoStatus, { nullable: true }) status?: TodoStatus,
    @Arg("cursor", { nullable: true }) cursor?: number
  ): Promise<Todo[]> {
    const { id } = user;
    let queryResult: Todo[] | ErrorInfo;

    if (!status) queryResult = await TodoService.findAllByUserId(id, cursor);
    else queryResult = await TodoService.findAllByUserIdAndStatus(id, status, cursor);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => RegisterOutput)
  async register(@Arg("registerInput") registerInput: RegisterInput): Promise<RegisterOutput> {
    const user: User = new User();
    user.name = registerInput.name;
    user.password = registerInput.password;
    user.email = registerInput.email;

    let queryResult: RegisterOutput | ErrorInfo = await UserService.register(user);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
