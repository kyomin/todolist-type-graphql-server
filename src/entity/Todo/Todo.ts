import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn } from "typeorm";
import { ObjectType, Field, Int, ID } from "type-graphql";
import { Min, MaxLength, MinLength } from "class-validator";

import { User, TodoStatus, Validation } from "../index";

@ObjectType()
@Entity()
export class Todo extends Validation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  userId: number;

  @Field()
  @Column("text")
  description: string;

  @Field()
  @Column({
    type: "enum",
    enum: TodoStatus,
  })
  status: TodoStatus;

  @Field()
  @Column("text")
  deadline: string;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.todos)
  user: User;
}
