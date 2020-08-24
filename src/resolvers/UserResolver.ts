import { Resolver, FieldResolver, Query, Mutation, Arg, Root } from 'type-graphql';
import { User, Todo, TodoStatus } from '../entity';
import { UserService, TodoService } from '../services';

@Resolver(() => User)
export class UserResolver {
  @Query(returns => User, { nullable: true })
  async user(@Arg('id') id: number) {
    return UserService.findOneById(id);
  }

  @FieldResolver(returns => [Todo], { nullable: true })
  async todos(
    @Root() user: User, 
    @Arg('cursor', { nullable: true }) cursor: number, 
    @Arg('status', type => TodoStatus, { nullable: true }) status?: TodoStatus
  ) {
    const { id } = user;

    if(!status) {
      return TodoService.findAllByUserId(cursor, id);
    } else {
      return TodoService.findAllByUserIdAndStatus(cursor, id, status);
    }
  }

  @Mutation(returns => Boolean)
  async signup(@Arg('name') name: string) {
    return UserService.save(name);
  }
}