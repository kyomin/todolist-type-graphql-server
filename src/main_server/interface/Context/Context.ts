import { UserTokenPayload } from "../";

export interface Context {
  user?: UserTokenPayload;
  error?: Error;
}
