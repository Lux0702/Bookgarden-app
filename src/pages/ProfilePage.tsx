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
import {launchImageLibrary} from 'react-native-image-picker';

const ProifilePage = ({navigation}: any) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValiPhone] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [date, setDate] = useState(new Date());
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState('');
  // const [count, setCount] = useState(60);
  const [visible, setVisible] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    // if (!validator.isEmail(text)) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Lỗi',
    //     text2: 'Email không hợp lệ',
    //   });
    // }
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (count === 0) {
  //       clearInterval(interval);
  //     } else {
  //       setCount(count - 1);
  //     }
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [count]);
  const handleSubmit = async () => {
    // try {
    //   const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (response.ok) {
    //     console.log('Đăng nhập thành công');
    //   } else {
    //     console.error('Đăng nhập không thành công');
    //   }
    // } catch (error) {
    //   console.error('Lỗi:', error);
    // }
    setVisible(true);
  };
  const formatDate = (rawDate: Date) => {
    const date = new Date(rawDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleImagePress = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //     {
    //       title: 'Quyền truy cập thư viện ảnh',
    //       message: 'Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình ảnh.',
    //       buttonNeutral: 'Hỏi sau',
    //       buttonNegative: 'Hủy',
    //       buttonPositive: 'OK',
    //     },
    //   );
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     launchImageLibrary({mediaType: 'photo'}, response => {
    //       if (response.assets && response.assets.length > 0) {
    //         const selectedImage = response.assets[0];
    //         setAvatar(selectedImage.uri ?? null);
    //       } else {
    //         console.log('Người dùng đã hủy bỏ chọn ảnh.');
    //       }
    //     });
    //   } else {
    //     console.log('Quyền truy cập thư viện ảnh không được cấp.');
    //   }
    // } catch (error) {
    //   console.error('Lỗi khi yêu cầu quyền truy cập thư viện ảnh:', error);
    // }
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
  const handlePhoneChange = (text: any) => {
    setPhone(text);
    setIsValiPhone(
      text.length > 0 && validator.isMobilePhone(text) ? false : true,
    );
  };
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('OTP')}>
        <Image source={require('../assets/icons/back-icon.png')} />
        <Text style={styles.titleProfile}> Thông tin cá nhân</Text>
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
          <Text style={styles.buttonText}>Xác nhận</Text>
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
export default ProifilePage;
