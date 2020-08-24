import { User } from '../entity';

export class UserService {
  public static findOneById (id: number) : Promise<User | null> {
    return User.findOne({ id: id })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
  }

  public static save (name: string) : Promise<boolean | any> {
    return User.insert({ name: name })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
  }
}