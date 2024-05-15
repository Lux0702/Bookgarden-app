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
import Spinner from 'react-native-loading-spinner-overlay';
import {isLoggedIn, logout} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useProfileData} from '../utils/api';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import {useNavigationState} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
interface tokenProp {
  accessToken: string;
  refreshToken: string;
}
const UserManager = ({navigation}: any) => {
  let {IsChange, checkTokenExpiration} = useTokenExpirationCheck();
  const navigationState = useNavigationState(state => state);
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  const login = isLoggedIn();
  const [token, setToken] = useState<tokenProp | null>(null);
  const isUserTabFocused =
    navigationState.index === 3 &&
    navigationState.routes[navigationState.index].name === 'Cá nhân';
  let {userData, fetchProfileData} = useProfileData({token});
  // const [count, setCount] = useState(60);
  const [visible, setVisible] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);
  const [spining, setSpining] = useState(false);
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
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await checkTokenExpiration();
        } catch (error) {
          console.log('Lỗi kiểm tra token:', error);
        }
      };
      fetchData();
      // Không có return hoặc trả về undefined ở đây
    }, [isUserTabFocused, login, token]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const getTokenAndFetchData = async () => {
        try {
          const tokenFromStorage = await AsyncStorage.getItem('token');
          if (tokenFromStorage) {
            const parsedToken = JSON.parse(tokenFromStorage);
            setToken(parsedToken); // Cập nhật state token với giá trị từ AsyncStorage
            console.log('Token', parsedToken);
          }
        } catch (error) {
          console.log('Error fetching token or data:', error);
        }
      };
      getTokenAndFetchData();
    }, [isUserTabFocused, IsChange]),
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchDataIfNeeded = async () => {
        if (login) {
          try {
            setSpining(true);
            await fetchProfileData().then(() => {
              setFullName(userData?.fullName || '');
              setAvatar(userData?.avatar || '');
            });
          } catch (error) {
            console.log('Error fetch:', error);
          } finally {
            setSpining(false);
          }
        } else if (!login) {
          setVisible(true);
        }
      };
      fetchDataIfNeeded();
    }, [isUserTabFocused, token]),
  );
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('OTP')}>
        <Text style={styles.titleProfile}> Quản lí tài khoản</Text>
      </TouchableOpacity>
      {login ? (
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
                  userData?.avatar
                    ? {uri: userData.avatar}
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
          <Text style={styles.title}>{userData?.fullName}</Text>
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
                navigation.navigate('ProfileUser', {
                  userData: userData,
                });
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
                navigation.navigate('HistoryPage');
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
                navigation.navigate('Yêu thích');
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
      ) : (
        <View style={styles.login}>
          <Pressable
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Text style={styles.contentTilte}>Đăng nhập</Text>
          </Pressable>
        </View>
      )}

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
                  logout();
                  AsyncStorage.removeItem('token').then(() => {
                    // @ts-ignore
                    navigation.navigate('Home');
                    setVisible(false);
                  });
                }}>
                <Text style={styles.title}>Có</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
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
  spinnerTextStyle: {
    color: 'black',
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
  login: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    marginTop: 10,
    alignItems: 'center',
    lineHeight: 30,
    backgroundColor: '#ccc',
    borderRadius: 12,
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
