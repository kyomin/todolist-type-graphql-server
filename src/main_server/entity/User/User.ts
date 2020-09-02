import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Todo } from "../index";
import { RoleStatus } from "../../enum";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "text" })
  name: string;

  @Field()
  @Column("varchar", { length: 320, unique: true })
  email: string;

  @Field()
  @Column("varchar", { length: 128 })
  password: string;

  @Field()
  @Column({
    type: "enum",
    enum: RoleStatus,
  })
  role: RoleStatus;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @OneToMany((type) => Todo, (todo) => todo.user)
  todos: Todo[];
}
