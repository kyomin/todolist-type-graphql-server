import { User } from "../../entity";
import { UserProxy } from "../../proxy";
import { RegisterOutput } from "../../dto";
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

  private static emailConflictException: ErrorInfo = new ErrorInfo(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "이미 존재하는 이메일입니다. 다른 이메일을 등록해 주십시오."
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

  public static async register(newUser: User): Promise<RegisterOutput | ErrorInfo> {
    try {
      let registerOutput: RegisterOutput;
      let createdUserId: number;
      let existingUser = await User.findOne({ email: newUser.email });

      if (existingUser) return this.emailConflictException;

      let encryptedPassword = await UserProxy.encryptPassword(newUser.password);
      newUser.password = encryptedPassword;

      createdUserId = await (await User.insert(newUser)).identifiers[0].id;

      newUser = await User.findOne({ id: createdUserId });

      if (!newUser) return this.createException;

      registerOutput = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      return registerOutput;
    } catch (err) {
      return this.createException;
    }
  }
}
