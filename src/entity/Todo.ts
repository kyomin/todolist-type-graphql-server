import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm';
import { registerEnumType, ObjectType, InputType, Field, Int, ID } from 'type-graphql';

import { User } from './User';

export enum TodoStatus {
  TODO=1,
  DONE
}

registerEnumType(TodoStatus, {
  name: "TodoStatus"
});

@InputType()
export class MakeTodoInput implements Partial<Todo> {
  @Field(() => Int)
  userId: number;

  @Field()
  description: string;

  @Field(type => TodoStatus)
  status: TodoStatus;

  @Field()
  deadline: string;
}

@ObjectType()
@Entity()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column('int')
  userId: number;

  @Field()
  @Column('text')
  description: string;

  @Field(type => TodoStatus)
  @Column({
    type: 'enum',
    enum: TodoStatus
  })
  status: TodoStatus;

  @Field()
  @Column('text')
  deadline: string;

  @Field(() => Date)
  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;

  @ManyToOne(
    type => User, 
    (user) => user.todos
  )
  user: User
}