// import Realm from 'realm';
// import User from '../utils/User';

// export default function migrateUser(realm: Realm) {
//   if (realm.schemaVersion < 1) {
//     const oldUsers = realm.objects('User') as Realm.Results<User>;
//     const newUsers = realm.create('User', {
//       password: '',
//       email: '',
//     }) as Realm.Results<User>;
//     for (let i = 0; i < oldUsers.length; i++) {
//       const oldUser = oldUsers[i];
//       const newUser = newUsers[i];
//       newUser.username = oldUser.name;
//       // Cập nhật các thuộc tính khác nếu cần
//     }
//   }
// }
