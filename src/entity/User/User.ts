import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Todo } from "../index";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID, {})
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  name: string;

  @OneToMany((type) => Todo, (todo) => todo.user)
  todos: Todo[];
}
