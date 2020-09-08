import { InputType, Field } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";

import { TodoStatus } from "../../../enum";

@InputType()
export class MakeTodoInput {
  @MinLength(5, { message: "할 일 내용은 5글자 이상이어야 합니다" })
  @MaxLength(100, { message: "할 일 내용은 100자 이내여야 합니다" })
  @Field()
  description: string;

  @Field((type) => TodoStatus)
  status: TodoStatus;

  @Field()
  deadline: string;
}
