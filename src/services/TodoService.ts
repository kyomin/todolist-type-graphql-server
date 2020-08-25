import { Todo, TodoStatus, MakeTodoInput } from '../entity';
import { GET_TODO_LIMIT } from '../utils/constants';
import { LessThan } from 'typeorm';

export class TodoService {
  public static findOneById (id: number) : Promise<Todo | undefined> {
    return Todo.findOne({ id: id })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
      return undefined;
    });
  }

  public static findAll (cursor: number | undefined) : Promise<[Todo] | any> {
    if(cursor) {
      return Todo.find({
        where: { id: LessThan(cursor) },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    } else {
      return Todo.find({
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    }
  }

  public static findAllByStatus (cursor: number | undefined, status: TodoStatus) : Promise<[Todo] | any> {
    if(cursor) {
      return Todo.find({ 
        where: {
          id: LessThan(cursor), 
          status: status
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    } else {
      return Todo.find({ 
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    }
  }

  public static findAllByUserId (cursor: number | undefined, userId: number) : Promise<[Todo] | any> {
    if(cursor) {
      return Todo.find({
        where: { 
          id: LessThan(cursor),
          userId: userId
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    } else {
      return Todo.find({
        where: { userId: userId },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    }
  }

  public static findAllByUserIdAndStatus (cursor: number | undefined, userId: number, status: TodoStatus) : Promise<[Todo] | any> {
    if(cursor) {
      return Todo.find({
        where: { 
          id: LessThan(cursor),
          userId: userId,
          status: status
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    } else {
      return Todo.find({
        where: { 
          userId: userId,
          status: status
        },
        order: { id: "DESC" },
        take: GET_TODO_LIMIT + 1
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    }
    
  }

  public static save (makeTodoInput: MakeTodoInput) : Promise<boolean | any> {
    return Todo.insert(makeTodoInput)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
  }

  public static updateOneByStatus (id: number, changedStatus: TodoStatus) : Promise<boolean | any> {
    return Todo.update({ id: id }, { status: changedStatus })
    .then(() => {
      return true; 
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
  }

  public static updateOneByDescription (id: number, newDescription: string) : Promise<boolean | any> {
    return Todo.update({ id: id }, { description: newDescription })
    .then(() => {
      return true; 
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
  }

  public static deleteOneById (id: number) : Promise<boolean | any> {
    return this.findOneById(id)
    .then((deleteWantedTodo) => {
      if(deleteWantedTodo) {
        return Todo.remove(deleteWantedTodo)
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
      }
      
      return false;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
  }
}