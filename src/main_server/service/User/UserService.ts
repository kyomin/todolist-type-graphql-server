import { User } from "../../entity";
import { UserProxy } from "../../proxy";
import { UserInfoOutput } from "../../dto";
import { CommonErrorInfo } from "../../../../error/CommonErrorInfo";
import { CommonErrorCode } from "../../../../error/CommonErrorCode";
import { logger } from "../../../../config/winston";

export class UserService {
  /* Exception Variables */
  private static readException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 회원 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static createException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 회원 등록에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static emailConflictException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.ALREADY_REGISTERED,
    "이미 존재하는 이메일입니다. 다른 이메일을 등록해 주십시오."
  );

  /* Business Method */
  public static async findOneById(id: number): Promise<UserInfoOutput | CommonErrorInfo> {
    try {
      let user: User = await User.findOne({ id: id });
      if (!user) return this.readException;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (err) {
      return this.readException;
    }
  }

  public static async register(newUser: User): Promise<UserInfoOutput | CommonErrorInfo> {
    try {
      let createdUserId: number;
      let existingUser = await User.findOne({ email: newUser.email });

      if (existingUser) return this.emailConflictException;

      let encryptedPassword = await UserProxy.encryptPassword(newUser.password);
      newUser.password = encryptedPassword;

      createdUserId = await (await User.insert(newUser)).identifiers[0].id;

      newUser = await User.findOne({ id: createdUserId });

      if (!newUser) return this.createException;

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
    } catch (err) {
      logger.error(err);

      return this.createException;
    }
  }
}
