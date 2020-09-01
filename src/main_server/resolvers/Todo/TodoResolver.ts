import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { User, Todo, TodoStatus, MakeTodoInput } from "../../entity";
import { TodoService, UserService } from "../../services";
import { ErrorInfo } from "../../../../error/ErrorInfo";
import { ErrorCode } from "../../../../error/ErrorCode";

@Resolver(() => Todo)
export class TodoResolver {
  @Query((returnType) => [Todo!]!)
  async todos(
    @Arg("cursor", { nullable: true }) cursor?: number,
    @Arg("status", (type) => TodoStatus, { nullable: true }) status?: TodoStatus
  ): Promise<Todo[]> {
    let queryResult: Todo[] | ErrorInfo;

    if (!status) queryResult = await TodoService.findAll(cursor);
    else queryResult = await TodoService.findAllByStatus(cursor, status);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @FieldResolver((returnType) => User)
  async user(@Root() todo: Todo): Promise<User> {
    const { userId } = todo;
    let queryResult: User | ErrorInfo = await UserService.findOneById(userId);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async makeTodo(@Arg("makeTodoInput") makeTodoInput: MakeTodoInput): Promise<Todo> {
    const todo: Todo = new Todo();
    todo.userId = makeTodoInput.userId;
    todo.description = makeTodoInput.description;
    todo.status = makeTodoInput.status;
    todo.deadline = makeTodoInput.deadline;

    let queryResult: Todo | ErrorInfo = await TodoService.save(todo);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async updateTodoStatus(@Arg("id") id: number, @Arg("changedStatus", (type) => TodoStatus) changedStatus: TodoStatus): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", ErrorCode.ARGUMENT_VALIDATION_ERROR);

    const todo: Todo = new Todo();
    todo.id = id;

    let queryResult: Todo | ErrorInfo = await TodoService.updateOneByStatus(id, changedStatus);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async updateTodoDescription(@Arg("id") id: number, @Arg("newDescription") newDescription: string): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", ErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newDescription.length < 5) throw new ApolloError("할 일 내용은 5글자 이상이어야 합니다.", ErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newDescription.length > 100) throw new ApolloError("할 일 내용은 100자 이내여야 합니다.", ErrorCode.ARGUMENT_VALIDATION_ERROR);

    let queryResult: Todo | ErrorInfo = await TodoService.updateOneByDescription(id, newDescription);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async deleteTodo(@Arg("id") id: number): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", ErrorCode.ARGUMENT_VALIDATION_ERROR);

    const todo: Todo = new Todo();
    todo.id = id;

    let queryResult: Todo | ErrorInfo = await TodoService.deleteOneById(id);

    if (queryResult instanceof ErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
