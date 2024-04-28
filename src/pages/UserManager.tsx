import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  PermissionsAndroid,
  Button,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {useNavigation} from '@react-navigation/native';
import {API_BASE} from '../utils/utils';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import {Divider} from 'react-native-paper';
import Modal from 'react-native-modal';

const UserManager = ({navigation}: any) => {
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  // const [count, setCount] = useState(60);
  const [visible, setVisible] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);
  const handleImagePress = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        // const result: any = await launchCamera({
        //   mediaType: 'photo',
        //   cameraType: 'front',
        // });
        const result: any = await launchImageLibrary({mediaType: 'photo'});
        console.log(result.assets[0].uri);
        setAvatar(result.assets[0].uri);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('OTP')}>
        <Text style={styles.titleProfile}> Quản lí tài khoản</Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={[styles.imageProfile]}>
          <Pressable onPress={handleImagePress}>
            <Image
              source={
                avatar !== ''
                  ? {uri: avatar}
                  : require('../assets/images/profile.png')
              }
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>

          <Image
            source={require('../assets/icons/editIcon.png')}
            style={styles.icon}
          />
        </View>
        <Text style={styles.title}>Nguyễn Thanh Sang</Text>
        <View style={styles.contentContaier}>
          <View style={styles.contentRow}>
            <Image
              source={require('../assets/icons/user-edit.png')}
              style={styles.contentIcon}
            />
            <Text style={styles.contentTilte}>Thông tin cá nhân</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileUser');
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}>
            <Image
              source={require('../assets/icons/arrow-right.png')}
              style={styles.contentArrow}
            />
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.contentContaier}>
          <View style={styles.contentRow}>
            <Image
              source={require('../assets/icons/setting.png')}
              style={styles.contentIcon}
            />
            <Text style={styles.contentTilte}>Lịch sử đơn hàng</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Order');
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}>
            <Image
              source={require('../assets/icons/arrow-right.png')}
              style={styles.contentArrow}
            />
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.contentContaier}>
          <View style={styles.contentRow}>
            <Image
              source={require('../assets/icons/heart.png')}
              style={styles.contentIcon}
            />
            <Text style={styles.contentTilte}>Danh sách yêu thích</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Wishlist');
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}>
            <Image
              source={require('../assets/icons/arrow-right.png')}
              style={styles.contentArrow}
            />
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.contentContaier}>
          <View style={styles.contentRow}>
            <Image
              source={require('../assets/icons/notification.png')}
              style={styles.contentIcon}
            />
            <Text style={styles.contentTilte}>Thông báo</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notification');
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}>
            <Image
              source={require('../assets/icons/arrow-right.png')}
              style={styles.contentArrow}
            />
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.contentContaier}>
          <View style={styles.contentRow}>
            <Image
              source={require('../assets/icons/logout.png')}
              style={styles.contentIcon}
            />
            <Pressable
              onPress={() => {
                // navigation.navigate('Login');
                setVisible(true);
              }}>
              <Text style={styles.contentTilte}>Đăng xuất</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Toast />
      <Modal
        style={styles.modal}
        isVisible={visible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.2}
        backdropColor="black"
        animationInTiming={700}
        animationOutTiming={700}
        onBackdropPress={() => setVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.contentModal}>
            <Text style={styles.titleModal}>Đăng xuất</Text>
            <Divider />
            <Text style={[styles.title, {marginTop: 20}]}>
              Bạn có muốn đăng xuất
            </Text>
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.buttonLogout, {backgroundColor: '#ccc'}]}
                onPress={() => {
                  setVisible(false);
                }}>
                <Text style={styles.title}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonLogout}
                onPress={() => {
                  navigation.navigate('Home');
                }}>
                <Text style={styles.title}>Có</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  imageProfile: {
    width: 170,
    height: 170,
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 10,
  },
  titlecontainer: {
    width: '100%',
    height: 60,
    lineHeight: 35,
    padding: 10,
    marginTop: 10,
    flexDirection: 'column',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleProfile: {
    fontSize: 20,
    width: '90%',
    color: '#262626',
    textAlign: 'center',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    width: '100%',
    color: '#262626',
    textAlign: 'center',
    fontWeight: '300',
    alignItems: 'center',
    justifyContent: 'center',
    fontStyle: 'italic',
  },
  titleModal: {
    fontSize: 25,
    width: '100%',
    color: '#262626',
    textAlign: 'center',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    resizeMode: 'contain',
    width: 170,
    height: 170,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderRadius: 100,
    borderWidth: 1,
  },
  successIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  icon: {
    position: 'absolute',
    width: 30,
    height: 30,
    padding: 10,
    right: 0,
    bottom: 30,
    left: 147,
  },
  contentIcon: {
    width: 30,
    height: 30,
    padding: 5,
  },
  contentArrow: {
    width: 20,
    height: 20,
  },
  scrollview: {
    flexGrow: 1,
    width: '100%',
    marginBottom: 70,
  },
  dialog: {
    backgroundColor: 'white',
  },
  spinner: {
    margin: 10,
  },
  contentContaier: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 10,
    alignItems: 'center',
    lineHeight: 30,
  },
  contentRow: {
    flexDirection: 'row',
    height: 60,
    marginTop: 30,
    lineHeight: 30,
    alignContent: 'center',
    width: '90%',
  },
  contentTilte: {
    fontSize: 20,
    marginLeft: 20,
    color: '#6B7280',
  },
  divider: {
    color: 'red',
    height: 1,
    width: '90%',
  },
  modalView: {
    backgroundColor: 'white',
    height: '30%',
    width: '100%',
    borderRadius: 20,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentModal: {
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  buttonLogout: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
    borderRadius: 25,
  },
});
export default UserManager;
