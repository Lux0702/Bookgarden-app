import Realm from 'realm';

class User extends Realm.Object {
  static schema: {
    name: string;
    properties: {
      id: {type: string; default: number};
      name: string;
      password: string;
      email: string;
    };
  };
}

User.schema = {
  name: 'User',
  properties: {
    id: {type: 'int', default: 0},
    name: 'string',
    password: 'string',
    email: 'string',
  },
};

export default User;
