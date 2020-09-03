import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { Todo } from "../../entity";
import { MakeTodoInput, UserInfoOutput } from "../../dto";
import { TodoStatus } from "../../enum";
import { TodoService, UserService } from "../../service";
import { CommonErrorInfo } from "../../../../error/CommonErrorInfo";
import { CommonErrorCode } from "../../../../error/CommonErrorCode";

@Resolver(() => Todo)
export class TodoResolver {
  @Query((returnType) => [Todo!]!)
  async todos(
    @Arg("cursor", { nullable: true }) cursor?: number,
    @Arg("status", (type) => TodoStatus, { nullable: true }) status?: TodoStatus
  ): Promise<Todo[]> {
    let queryResult: Todo[] | CommonErrorInfo;

    if (!status) queryResult = await TodoService.findAll(cursor);
    else queryResult = await TodoService.findAllByStatus(cursor, status);

    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @FieldResolver((returnType) => UserInfoOutput)
  async user(@Root() todo: Todo): Promise<UserInfoOutput> {
    const { userId } = todo;

    const queryResult: UserInfoOutput | CommonErrorInfo = await UserService.findOneById(userId);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async makeTodo(@Arg("makeTodoInput") makeTodoInput: MakeTodoInput): Promise<Todo> {
    const newTodo: Todo = new Todo();
    newTodo.userId = makeTodoInput.userId;
    newTodo.description = makeTodoInput.description;
    newTodo.status = makeTodoInput.status;
    newTodo.deadline = makeTodoInput.deadline;

    const queryResult: Todo | CommonErrorInfo = await TodoService.save(newTodo);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async updateTodoStatus(@Arg("id") id: number, @Arg("changedStatus", (type) => TodoStatus) changedStatus: TodoStatus): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const queryResult: Todo | CommonErrorInfo = await TodoService.updateOneByStatus(id, changedStatus);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async updateTodoDescription(@Arg("id") id: number, @Arg("newDescription") newDescription: string): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newDescription.length < 5) throw new ApolloError("할 일 내용은 5글자 이상이어야 합니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newDescription.length > 100) throw new ApolloError("할 일 내용은 100자 이내여야 합니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const queryResult: Todo | CommonErrorInfo = await TodoService.updateOneByDescription(id, newDescription);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Mutation((returnType) => Todo)
  async deleteTodo(@Arg("id") id: number): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const queryResult: Todo | CommonErrorInfo = await TodoService.deleteOneById(id);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
