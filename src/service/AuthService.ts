import Realm from 'realm';
import User from '../utils/User';
// import migrateUser from '../utils/Migration';

// Khởi tạo Realm instance với migration
const realm = new Realm({
  schema: [User.schema],
  schemaVersion: 1,
  // migration: migrateUser,
});

// Thêm người dùng mới vào Realm
const addUser = (name: string, email: string, password: string) => {
  realm.write(() => {
    realm.create('User', {name, email, password});
  });
};

// Lấy người dùng từ Realm dựa trên tên người dùng
const getUser = (username: string) => {
  return realm.objects('User').filtered(`email = "${username}"`);
};

// Đăng xuất người dùng (xóa tất cả các người dùng từ Realm)
const logout = () => {
  return new Promise<void>(resolve => {
    realm.write(() => {
      realm.delete(realm.objects('User'));
      resolve(); // Gọi resolve() sau khi xóa hoàn thành
    });
  });
};

// Kiểm tra xem có người dùng đang đăng nhập không
const isLoggedIn = () => {
  const users = realm.objects('User');
  return users.length > 0;
};

export {addUser, getUser, logout, isLoggedIn};
