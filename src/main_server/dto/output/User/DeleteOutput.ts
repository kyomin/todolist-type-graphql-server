import { ObjectType, Field } from "type-graphql";

import { RoleStatus } from "../../../enum";

@ObjectType()
export class DeleteOutput {
  @Field()
  deleteSuccess: boolean;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: RoleStatus;
}
