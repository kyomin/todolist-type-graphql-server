import { ObjectType, Field } from "type-graphql";

import { RoleStatus } from "../../../enum";

@ObjectType()
export class LoginOutput {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: RoleStatus;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
