import { User } from "../../entity";
import { ErrorInfo } from "../../../../error/ErrorInfo";
import { ErrorCode } from "../../../../error/ErrorCode";
import { logger } from "../../../../config/winston";

export class UserService {
  /* Exception Variables */
  private static readException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 회원 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static createException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 회원 등록에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  /* Business Method */
  public static async findOneById(id: number): Promise<User | ErrorInfo> {
    let user: User;

    try {
      user = await User.findOne({ id: id });
    } catch (err) {
      logger.error(err);

      return this.readException;
    }

    if (!user) return this.readException;

    return user;
  }

  public static async save(name: string): Promise<User | ErrorInfo> {
    let createdUserId: number;
    let user: User;

    try {
      createdUserId = await (await User.insert({ name: name })).identifiers[0].id;
    } catch (err) {
      logger.error(err);

      return this.createException;
    }

    try {
      user = await User.findOne({ id: createdUserId });
    } catch (err) {
      logger.error(err);

      return this.createException;
    }

    return user;
  }
}
