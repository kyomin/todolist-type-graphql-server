import { Resolver, FieldResolver, Query, Mutation, Arg, Root, Authorized, Ctx, UseMiddleware } from "type-graphql";
import { ApolloError } from "apollo-server-express";

import { checkAdmin } from "../../middleware/checkAdmin";
import { Todo } from "../../entity";
import { MakeTodoInput, UserInfoOutput } from "../../dto";
import { TodoStatus } from "../../enum";
import { Context } from "../../interface";
import { TodoService, UserService } from "../../service";
import { CommonErrorInfo } from "../../../../error/CommonErrorInfo";
import { CommonErrorCode } from "../../../../error/CommonErrorCode";

@Resolver(() => Todo)
export class TodoResolver {
  // 해당 Todo를 등록한 User 정보를 가져온다.
  @FieldResolver((returnType) => UserInfoOutput)
  async user(@Root() todo: Todo): Promise<UserInfoOutput> {
    const { userId } = todo;

    const queryResult: UserInfoOutput | CommonErrorInfo = await UserService.findOneById(userId);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  // 관리자가 회원들이 등록한 모든 Todo를 브리핑하기 위한 쿼리이다.
  @Authorized()
  @UseMiddleware(checkAdmin)
  @Query((returnType) => [Todo!]!)
  async allTodos(): Promise<Todo[]> {
    const queryResult: Todo[] | CommonErrorInfo = await TodoService.findAll();
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  // 현재 로그인 한 유저가 등록한 Todo 목록을 불러오는 쿼리이다.
  @Authorized()
  @Query((returnType) => [Todo!]!)
  async todos(
    @Arg("cursor", { nullable: true }) cursor?: number,
    @Arg("status", (type) => TodoStatus, { nullable: true }) status?: TodoStatus,
    @Ctx() context?: Context
  ): Promise<Todo[]> {
    const userId: number = context.user.id;
    let queryResult: Todo[] | CommonErrorInfo;

    if (!status) queryResult = await TodoService.findAllByUserId(userId, cursor);
    else queryResult = await TodoService.findAllByUserIdAndStatus(userId, status, cursor);

    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Authorized()
  @Mutation((returnType) => Todo)
  async makeTodo(@Arg("makeTodoInput") makeTodoInput: MakeTodoInput, @Ctx() context?: Context): Promise<Todo> {
    const newTodo: Todo = new Todo();
    newTodo.userId = context.user.id;
    newTodo.description = makeTodoInput.description;
    newTodo.status = makeTodoInput.status;
    newTodo.deadline = makeTodoInput.deadline;

    const queryResult: Todo | CommonErrorInfo = await TodoService.save(newTodo);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Authorized()
  @Mutation((returnType) => Todo)
  async updateTodoStatus(@Arg("id") id: number, @Arg("newStatus", (type) => TodoStatus) newStatus: TodoStatus): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const queryResult: Todo | CommonErrorInfo = await TodoService.updateStatus(id, newStatus);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Authorized()
  @Mutation((returnType) => Todo)
  async updateTodoDescription(@Arg("id") id: number, @Arg("newDescription") newDescription: string): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newDescription.length < 5) throw new ApolloError("할 일 내용은 5글자 이상이어야 합니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);
    if (newDescription.length > 100) throw new ApolloError("할 일 내용은 100자 이내여야 합니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const queryResult: Todo | CommonErrorInfo = await TodoService.updateDescription(id, newDescription);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }

  @Authorized()
  @Mutation((returnType) => Todo)
  async deleteTodo(@Arg("id") id: number): Promise<Todo> {
    if (id < 1) throw new ApolloError("유효하지 않은 TODO의 ID 값입니다.", CommonErrorCode.ARGUMENT_VALIDATION_ERROR);

    const queryResult: Todo | CommonErrorInfo = await TodoService.delete(id);
    if (queryResult instanceof CommonErrorInfo) throw new ApolloError(queryResult.getMessage(), queryResult.getCode());

    return queryResult;
  }
}
