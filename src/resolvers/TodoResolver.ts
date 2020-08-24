import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from 'type-graphql';
import { User, Todo, TodoStatus, MakeTodoInput } from '../entity';
import { TodoService, UserService } from '../services';

@Resolver(() => Todo)
export class TodoResolver {
  @Query(returns => [Todo!]!)
  async todos(
    @Arg('cursor', { nullable: true }) cursor: number, 
    @Arg('status', type => TodoStatus, { nullable: true }) status?: TodoStatus
  ) {
    if(!status) {
      return TodoService.findAll(cursor);
    } else {
      return TodoService.findAllByStatus(cursor, status);
    }
  }

  @FieldResolver(returns => User)
  async user(@Root() todo: Todo) {
    const { userId } = todo;
    
    return UserService.findOneById(userId);
  }

  @Mutation(returns => Boolean)
  async makeTodo(@Arg('makeTodoInput') makeTodoInput: MakeTodoInput) {
    return TodoService.save(makeTodoInput);
  }

  @Mutation(returns => Boolean)
  async updateTodoStatus(
    @Arg('id') id: number, 
    @Arg('changedStatus', type => TodoStatus) changedStatus: TodoStatus
  ) {
    return TodoService.updateOneByStatus(id, changedStatus);
  }

  @Mutation(returns => Boolean)
  async updateTodoDescription(
    @Arg('id') id: number, 
    @Arg('newDescription') newDescription: string
  ) {
    return TodoService.updateOneByDescription(id, newDescription);
  }

  @Mutation(returns => Boolean)
  async deleteTodo(@Arg('id') id: number) {
    return TodoService.deleteOneById(id);
  }
}