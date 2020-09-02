import { LessThan } from "typeorm";

import { Todo } from "../../entity";
import { TodoStatus } from "../../enum";
import { GET_TODO_LIMIT } from "../../utils/constants";
import { ErrorInfo } from "../../../../error/ErrorInfo";
import { ErrorCode } from "../../../../error/ErrorCode";
import { logger } from "../../../../config/winston";

export class TodoService {
  /* Exception Variables */
  private static readException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 목록 불러오기에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static createException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 Todo 등록에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static updateException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 Todo 업데이트에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static deleteException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 해당 Todo를 삭제할 수 없습니다. 잠시 후 다시 시도해 주십시오."
  );

  /* Business Method */
  public static async findOneById(id: number): Promise<Todo | undefined> {
    return await Todo.findOne({ id: id });
  }

  public static async findAll(cursor?: number): Promise<Todo[] | ErrorInfo> {
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

  public static async findAllByStatus(cursor?: number, status?: TodoStatus): Promise<Todo[] | ErrorInfo> {
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

  public static async findAllByUserId(userId: number, cursor?: number): Promise<Todo[] | ErrorInfo> {
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

  public static async findAllByUserIdAndStatus(userId: number, status: TodoStatus, cursor?: number): Promise<Todo[] | ErrorInfo> {
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

  public static async save(todo: Todo): Promise<Todo | ErrorInfo> {
    let createdTodoId: number;

    try {
      createdTodoId = await (await Todo.insert(todo)).identifiers[0].id;
    } catch (err) {
      logger.error(err);

      return this.createException;
    }

    const createdTodo: Todo | undefined = await this.findOneById(createdTodoId);

    if (!createdTodo) return this.createException;

    return createdTodo;
  }

  public static async updateOneByStatus(id: number, changedStatus: TodoStatus): Promise<Todo | ErrorInfo> {
    try {
      await Todo.update({ id: id }, { status: changedStatus });
    } catch (err) {
      logger.error(err);

      return this.updateException;
    }

    const updatedTodo: Todo | undefined = await this.findOneById(id);
    if (!updatedTodo) return this.updateException;

    if (updatedTodo.status !== changedStatus) return this.updateException;

    return updatedTodo;
  }

  public static async updateOneByDescription(id: number, newDescription: string): Promise<Todo | ErrorInfo> {
    try {
      await Todo.update({ id: id }, { description: newDescription });
    } catch (err) {
      logger.error(err);

      return this.updateException;
    }

    let updatedTodo: Todo | undefined = await this.findOneById(id);
    if (!updatedTodo) return this.updateException;

    if (updatedTodo.description !== newDescription) {
      return this.updateException;
    }

    return updatedTodo;
  }

  public static async deleteOneById(id: number): Promise<Todo | ErrorInfo> {
    const deleteWantedTodo: Todo | undefined = await this.findOneById(id);

    if (!deleteWantedTodo) return this.deleteException;

    let deletedTodo: Todo;
    try {
      deletedTodo = await Todo.remove(deleteWantedTodo);
    } catch (err) {
      logger.error(err);

      return this.deleteException;
    }

    if (await this.findOneById(id)) return this.deleteException;

    return deletedTodo;
  }
}
