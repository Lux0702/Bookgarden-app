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
  Modal,
  PermissionsAndroid,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {useNavigation} from '@react-navigation/native';
import {API_BASE} from '../utils/utils';
import {Dialog} from 'react-native-paper';
import {ActivityIndicator, MD2Colors, HelperText} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import validator from 'validator';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useUpdateProfile} from '../utils/api';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileUser = ({navigation, route}: any) => {
  let {checkTokenExpiration}: {checkTokenExpiration: () => void} =
    useTokenExpirationCheck();
  const {userData} = route.params || null;
  const [token, setToken] = useState<tokenProp | null>(null);
  let {fetchUpdateProfile} = useUpdateProfile({token});
  const [fullName, setFullName] = useState(userData?.fullName);
  const [phone, setPhone] = useState(userData?.phone);
  const [email, setEmail] = useState(userData?.email);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValiPhone] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [date, setDate] = useState(userData?.birthday);
  const [avatar, setAvatar] = useState(userData?.avatar);
  const [Isavatar, setIsAvatar] = useState(false);

  const [gender, setGender] = useState(userData?.gender);
  // const [count, setCount] = useState(60);
  const [visible, setVisible] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    }, []),
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
    }, []),
  );
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setBirthday(formatDate(currentDate));
  };
  useEffect(() => {
    if (date) {
      setBirthday(formatDate(date));
    }
  }, [date]);
  const hideDialog = () => setVisible(false);
  const handleEmailChange = ({text}: any) => {
    setEmail(text);
    setIsValidEmail(
      text.trim() !== '' && validator.isEmail(text) ? false : true,
    );
  };
  const handleSubmit = async () => {
    setVisible(true);
    handleUpdate();
  };
  const formatDate = (rawDate: Date) => {
    const dateTime = new Date(rawDate);
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear();
    return `${year}-${month}-${day}`;
  };
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
        setIsAvatar(true);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handlePhoneChange = (text: any) => {
    setPhone(text);
    setIsValiPhone(
      text.length > 0 && validator.isMobilePhone(text) ? false : true,
    );
  };
  const handleUpdate = async () => {
    const user = {
      userId: userData?.userId,
      email: userData?.email,
      role: userData?.role,
      points: userData?.points,
      addresses: userData?.addresses,
      fullName: fullName,
      phone: phone,
      gender: gender,
      avatar: Isavatar ? avatar : '',
      birthday: birthday,
    };
    console.log('thông tin cap nhat', user);
    if (fullName && phone && gender && avatar && birthday) {
      try {
        await fetchUpdateProfile(user);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Thông tin cá nhân ',
          text2: 'Cập nhật lỗi',
        });
      } finally {
        setVisible(false);
      }
    } else {
      Toast.show({
        type: 'info',
        text1: 'Thông tin cá nhân ',
        text2: 'Vui lòng nhập đủ thông tin',
      });
    }
  };
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      {/* <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.goBack()}>
        <Image source={require('../assets/icons/back-icon.png')} />
        <Text style={styles.titleProfile}> Thông tin cá nhân</Text>
      </TouchableOpacity> */}
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên người dùng"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
          <View style={[styles.helperText, !isValidPhone && {display: 'none'}]}>
            <HelperText type="error" visible={isValidPhone}>
              Số điện thoại không hợp lệ
            </HelperText>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phone}
            keyboardType="number-pad"
            onChangeText={text => handlePhoneChange(text)}
          />
          <View style={[styles.helperText, !isValidEmail && {display: 'none'}]}>
            <HelperText type="error" visible={isValidEmail}>
              Email không hợp lệ
            </HelperText>
          </View>

          <TextInput
            style={[styles.input, isValidEmail && styles.errorInput]}
            placeholder="Email"
            editable={false}
            value={email}
            onChangeText={text => handleEmailChange({text})}
          />
          <View style={styles.gender}>
            <RNPickerSelect
              onValueChange={value => setGender(value)}
              items={[
                {label: 'Nam', value: 'Male'},
                {label: 'Nữ', value: 'Female'},
              ]}
              placeholder={{label: 'Giới tính', value: null}}
              value={gender}
            />
          </View>
          <View style={styles.DatePicker}>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Chọn ngày sinh"
                value={birthday}
                onChangeText={setBirthday}
                editable={false}
                style={styles.input}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date('2300-1-1')}
                minimumDate={new Date('1900-1-1')}
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          disabled={
            fullName !== '' &&
            phone !== '' &&
            gender !== '' &&
            birthday !== '' &&
            email !== ''
              ? false
              : true
          }
          style={[
            styles.buttonSubmit,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor:
                fullName !== '' &&
                phone !== '' &&
                gender !== '' &&
                birthday !== '' &&
                email !== ''
                  ? '#3697A6'
                  : 'gray',
            },
          ]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
        {/* <Dialog.Title>This is a title</Dialog.Title> */}
        <Dialog.Content>
          <Image
            source={require('../assets/icons/success.png')}
            style={styles.successIcon}
          />
          <Text style={styles.title}> Đang xử lí. Vui lòng đợi!</Text>
          <ActivityIndicator
            animating={true}
            color={MD2Colors.green800}
            style={styles.spinner}
          />
        </Dialog.Content>
      </Dialog>
      <Toast />
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
  imageProfile: {
    width: 170,
    height: 170,
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 10,
    color: '#9CA3AF',
  },
  DatePicker: {
    width: '100%',
    marginLeft: 25,
  },
  titlecontainer: {
    width: '100%',
    height: 60,
    lineHeight: 35,
    padding: 10,
    marginTop: 30,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  helperText: {
    width: '90%',
    textAlign: 'left',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 5,
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
    marginTop: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
  },
  textDate: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  buttonSubmit: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  input: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 20,
    padding: 15,
    lineHeight: 25,
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  scrollview: {
    flexGrow: 1,
    width: '100%',
  },
  dialog: {
    backgroundColor: 'white',
  },
  spinner: {
    margin: 10,
  },
  gender: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
  },
});
export default ProfileUser;
