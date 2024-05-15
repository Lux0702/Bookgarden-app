// import Realm from 'realm';

// export default function migrateUser(realm: Realm): void {
//   Realm.open({
//     schema: [User.schema],
//     schemaVersion: 1,
//     migration: (
//       oldRealm: {objects: (arg0: string) => any},
//       newRealm: {objects: (arg0: string) => any},
//     ) => {
//       // Logic migration ở đây
//       const oldUsers = oldRealm.objects('User');
//       const newUsers = newRealm.objects('User');

//       for (let i = 0; i < oldUsers.length; i++) {
//         const oldUser = oldUsers[i];
//         const newUser = newUsers[i];
//         // Thêm các thuộc tính accessToken và refreshToken vào newUser
//         newUser.accessToken = oldUser.accessToken;
//         newUser.refreshToken = oldUser.refreshToken;
//       }
//     },
//   }).then(newRealm => {
//     // Quá trình migration đã hoàn tất
//   });
// }
