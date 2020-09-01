import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { User, Todo, TodoStatus } from "../../entity";
import { UserService, TodoService } from "../../services";
import { ExceptionCodeAndMessage } from "../../exceptions/ExceptionCodeAndMessage";

@Resolver((returnType) => User)
export class UserResolver {
  @Query((returnType) => User)
  async user(@Arg("id") id: number): Promise<User> {
    let queryResult: User | ExceptionCodeAndMessage = await UserService.findOneById(id);

    if (queryResult instanceof ExceptionCodeAndMessage) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @FieldResolver((returnType) => [Todo!]!)
  async todos(
    @Root() user: User,
    @Arg("status", (type) => TodoStatus, { nullable: true }) status?: TodoStatus,
    @Arg("cursor", { nullable: true }) cursor?: number
  ): Promise<Todo[]> {
    const { id } = user;
    let queryResult: Todo[] | ExceptionCodeAndMessage;

    if (!status) queryResult = await TodoService.findAllByUserId(id, cursor);
    else queryResult = await TodoService.findAllByUserIdAndStatus(id, status, cursor);

    if (queryResult instanceof ExceptionCodeAndMessage) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => User)
  async signup(@Arg("name") name: string): Promise<User> {
    let queryResult: User | ExceptionCodeAndMessage = await UserService.save(name);

    if (queryResult instanceof ExceptionCodeAndMessage) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
