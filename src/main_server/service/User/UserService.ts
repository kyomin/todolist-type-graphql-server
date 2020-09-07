import { User } from "../../entity";
import { UserProxy } from "../../proxy";
import { UserInfoOutput, LoginOutput } from "../../dto";
import { UserTokenPayload } from "../../interface";
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

  private static updateException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 회원 갱신에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static emailConflictException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.ALREADY_REGISTERED,
    "이미 존재하는 이메일입니다. 다른 이메일을 등록해 주십시오."
  );

  private static invalidLoginInputException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.INVALID_LOGIN_INPUT,
    "이메일 또는 비밀번호를 다시 한 번 확인해 주십시오."
  );

  private static loginException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.INTERNAL_SERVER_ERROR,
    "서버에 문제가 생겨 로그인에 실패했습니다. 잠시 후 다시 시도해 주십시오."
  );

  private static passwordUpdateException: CommonErrorInfo = new CommonErrorInfo(
    CommonErrorCode.SAME_PASSWORD_VALUE,
    "이전 비밀번호와 동일합니다. 새 비밀번호를 입력해 주십시오."
  );

  /* Business Method */
  public static async findOneById(id: number): Promise<UserInfoOutput | CommonErrorInfo> {
    try {
      const user: User = await User.findOne({ id: id });
      if (!user) return undefined;

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
      // 1. 이미 기존에 등록된 유저라면, UK 중복 에러를 던진다.
      const existingUser: User | undefined = await User.findOne({ email: newUser.email });
      if (existingUser) return this.emailConflictException;

      // 2. 이메일 중복 확인이 끝나면 평문의 비밀번호를 해쉬화한다.
      const encryptedPassword = await UserProxy.encryptPassword(newUser.password);
      newUser.password = encryptedPassword;

      // 3. 삽입 작업을 진행하고, 삽입 후에도 DB에 반영이 안 됐다면 save 에러이므로 예외 발생
      const createdUserId: number = await (await User.insert(newUser)).identifiers[0].id;
      newUser = await User.findOne({ id: createdUserId });
      if (!newUser) return this.createException;

      // 4. 모든 작업이 성공적으로 완료되면 삽입 결과물 리턴 !
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

  public static async login(email: string, plainPassword: string): Promise<LoginOutput | CommonErrorInfo> {
    try {
      // 1. 요청된 이메일이 DB에 있는지 찾는다. => 없는 경우 제대로 입력을 요하는 에러 메시지를 던진다
      const existingUser: User | undefined = await User.findOne({ email: email });
      if (!existingUser) return this.invalidLoginInputException;

      // 2. 이메일이 DB에 있으면 비밀번호가 일치하는지 확인한다. => 틀릴 경우에도 이메일과 비밀번호 중 무엇이 틀렸는지 정확히 알려주지 않는 에러 메시지를 던진다.
      if (!(await UserProxy.comparePassword(plainPassword, existingUser.password))) return this.invalidLoginInputException;

      // 3. 이메일과 비밀번호의 검증을 끝마쳤다면 최종적으로 토큰을 생성한다. => 토큰 생성이 제대로 이뤄지지 않은 경우도 로그인 실패로 간주한다.
      const payload: UserTokenPayload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };
      const accessToken = await UserProxy.generateAccessToken(payload);
      const refreshToken = await UserProxy.generateRefreshToken(payload);

      if (!accessToken || !refreshToken) return this.loginException;

      return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      logger.error(err);

      return this.loginException;
    }
  }

  public static async updatePassword(id: number, newPassword: string): Promise<UserInfoOutput | CommonErrorInfo> {
    try {
      const existingUser: User | undefined = await User.findOne({ id: id });

      // 이전 비밀번호 그대로 입력해서 변경을 시도했다면 잘못된 입력 에러 리턴
      if (await UserProxy.comparePassword(newPassword, existingUser.password)) return this.passwordUpdateException;

      // 새 비밀번호 암호화
      const encryptedNewPassword = await UserProxy.encryptPassword(newPassword);

      await User.update({ id: id }, { password: encryptedNewPassword });

      // 비밀번호 변경이 제대로 이뤄졌는지 확인한다. 변경되지 않았다면 DB 에러이다.
      const updatedUser: User = await User.findOne({ id: id });
      if (!(await UserProxy.comparePassword(newPassword, updatedUser.password))) return this.updateException;

      return await this.findOneById(id);
    } catch (err) {
      logger.error(err);

      return this.updateException;
    }
  }
}
