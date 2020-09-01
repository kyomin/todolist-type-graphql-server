import { LessThan } from "typeorm";

import { Todo, TodoStatus } from "../../entity";
import { GET_TODO_LIMIT } from "../../utils/constants";
import { ExceptionCodeAndMessage } from "../../exceptions/ExceptionCodeAndMessage";
import { ExceptionCodeEnum } from "../../exceptions/ExceptionCodeEnum";
import { logger } from "../../../config/winston";

export class TodoService {
  /* Exception Variables */
  private static readException: ExceptionCodeAndMessage = new ExceptionCodeAndMessage(
    ExceptionCodeEnum.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 목록 불러오기에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static createException: ExceptionCodeAndMessage = new ExceptionCodeAndMessage(
    ExceptionCodeEnum.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 Todo 등록에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static updateException: ExceptionCodeAndMessage = new ExceptionCodeAndMessage(
    ExceptionCodeEnum.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 Todo 업데이트에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static deleteException: ExceptionCodeAndMessage = new ExceptionCodeAndMessage(
    ExceptionCodeEnum.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 해당 Todo를 삭제할 수 없습니다. 잠시 후 다시 시도해 주십시오."
  );

  /* Business Method */
  public static async findOneById(id: number): Promise<Todo | undefined> {
    return await Todo.findOne({ id: id });
  }

  public static async findAll(cursor?: number): Promise<Todo[] | ExceptionCodeAndMessage> {
    let findCondition;

    if (cursor) {
      findCondition = {
        where: { id: LessThan(cursor) },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    } else {
      findCondition = {
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    }

    try {
      return await Todo.find(findCondition);
    } catch (err) {
      logger.error(err);

      return this.readException;
    }
  }

  public static async findAllByStatus(cursor?: number, status?: TodoStatus): Promise<Todo[] | ExceptionCodeAndMessage> {
    let findCondition;

    if (cursor) {
      findCondition = {
        where: {
          id: LessThan(cursor),
          status: status,
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    } else {
      findCondition = {
        where: {
          status: status,
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    }

    try {
      return await Todo.find(findCondition);
    } catch (err) {
      logger.error(err);

      return this.readException;
    }
  }

  public static async findAllByUserId(userId: number, cursor?: number): Promise<Todo[] | ExceptionCodeAndMessage> {
    let findCondition;

    if (cursor) {
      findCondition = {
        where: {
          id: LessThan(cursor),
          userId: userId,
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    } else {
      findCondition = {
        where: { userId: userId },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    }

    try {
      return await Todo.find(findCondition);
    } catch (err) {
      logger.error(err);

      return this.readException;
    }
  }

  public static async findAllByUserIdAndStatus(userId: number, status: TodoStatus, cursor?: number): Promise<Todo[] | ExceptionCodeAndMessage> {
    let findCondition;

    if (cursor) {
      findCondition = {
        where: {
          id: LessThan(cursor),
          userId: userId,
          status: status,
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    } else {
      findCondition = {
        where: {
          userId: userId,
          status: status,
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1,
      };
    }

    try {
      return await Todo.find(findCondition);
    } catch (err) {
      logger.error(err);

      return this.readException;
    }
  }

  public static async save(todo: Todo): Promise<Todo | ExceptionCodeAndMessage> {
    // 삽입이 성공되고 삽입된 Todo row의 ID 값을 가져온다.
    let createdTodoId: number;

    try {
      createdTodoId = await (await Todo.insert(todo)).identifiers[0].id;
    } catch (err) {
      logger.error(err);

      return this.createException;
    }

    // 삽입이 성공된 Todo의 정보를 가져온다.
    const createdTodo: Todo | undefined = await this.findOneById(createdTodoId);

    // 그런데 undefined라면 삽입이 실패한 것이므로 에러를 throw한다.
    if (!createdTodo) {
      return this.createException;
    }

    // 예외 검증이 완료되었으므로 정상 결과를 리턴한다.
    return createdTodo;
  }

  public static async updateOneByStatus(id: number, changedStatus: TodoStatus): Promise<Todo | ExceptionCodeAndMessage> {
    try {
      await Todo.update({ id: id }, { status: changedStatus });
    } catch (err) {
      logger.error(err);

      return this.updateException;
    }

    // 애초에 갱신하고자 하는 ID가 DB에 없는 상황이라면
    const updatedTodo: Todo | undefined = await this.findOneById(id);
    if (!updatedTodo) {
      return this.updateException;
    }

    // 기존 status 값과 바꾸고자 하는 것이 일치하지 않으면 갱신 실패 !!
    if (updatedTodo.status !== changedStatus) {
      return this.updateException;
    }

    // 에러 던짐 없이 모든 검증을 끝마쳤으면 갱신 작업이 완료된 것이므로 갱신된 객체 타입을 던진다
    return updatedTodo;
  }

  public static async updateOneByDescription(id: number, newDescription: string): Promise<Todo | ExceptionCodeAndMessage> {
    try {
      await Todo.update({ id: id }, { description: newDescription });
    } catch (err) {
      logger.error(err);

      return this.updateException;
    }

    // 애초에 갱신하고자 하는 ID가 DB에 없는 상황이라면
    let updatedTodo: Todo | undefined = await this.findOneById(id);
    if (!updatedTodo) {
      return this.updateException;
    }

    // 기존 description과 바꾸고자 하는 것이 일치하지 않으면 갱신 실패 !!
    if (updatedTodo.description !== newDescription) {
      return this.updateException;
    }

    // 에러 던짐 없이 모든 검증을 끝마쳤으면 갱신 작업이 완료된 것이므로 갱신된 객체 타입을 던진다
    return updatedTodo;
  }

  public static async deleteOneById(id: number): Promise<Todo | ExceptionCodeAndMessage> {
    const deleteWantedTodo: Todo | undefined = await this.findOneById(id);

    // 삭제 대상이 테이블에 없으면 찾을 수 없는 대상의 에러를 던진다.
    if (!deleteWantedTodo) {
      return this.deleteException;
    }

    // 존재한다면 삭제를 한다. 하지만 remove 함수가 처리에 실패해 reject를 리턴했다면 catch문으로 빠진다.
    let deletedTodo: Todo;
    try {
      deletedTodo = await Todo.remove(deleteWantedTodo);
    } catch (err) {
      logger.error(err);

      return this.deleteException;
    }

    // remove 작업까지 완료했는데, 아직 테이블에 남아있다면
    if (await this.findOneById(id)) {
      return this.deleteException;
    }

    // 에러 던짐 없이 모든 검증을 끝마쳤으면 삭제 작업이 완료된 것이므로 삭제된 객체 타입을 던진다
    return deletedTodo;
  }
}
