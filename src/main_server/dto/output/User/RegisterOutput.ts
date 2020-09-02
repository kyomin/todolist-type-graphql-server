import { ObjectType, Field } from "type-graphql";

import { RoleStatus } from "../../../enum";

@ObjectType()
export class RegisterOutput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: RoleStatus;
}
