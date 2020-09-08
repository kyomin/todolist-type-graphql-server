import { RoleStatus } from "../enum";

export interface UserTokenPayload {
  id: number;
  email: string;
  role: RoleStatus;
}
