import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { ObjectType, Field, Int, ID } from "type-graphql";

import { User } from "../";
import { TodoStatus } from "../../enum";

@ObjectType()
@Entity()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int" })
  userId: number;

  @Field()
  @Column("varchar", { length: "100" })
  description: string;

  @Field()
  @Column({ type: "enum", enum: TodoStatus })
  status: TodoStatus;

  @Field()
  @Column({ type: "text" })
  deadline: string;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.todos)
  user: User;
}
