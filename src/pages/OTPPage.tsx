import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import tw from 'tailwind-react-native-classnames';
import {API_BASE} from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const OTPPage = ({navigation}: any) => {
  const et1 = useRef<TextInput>(null);
  const et2 = useRef<TextInput>(null);
  const et3 = useRef<TextInput>(null);
  const et4 = useRef<TextInput>(null);
  const et5 = useRef<TextInput>(null);
  const et6 = useRef<TextInput>(null);
  const [f1, setF1] = useState('');
  const [f2, setF2] = useState('');
  const [f3, setF3] = useState('');
  const [f4, setF4] = useState('');
  const [f5, setF5] = useState('');
  const [f6, setF6] = useState('');
  const [count, setCount] = useState(60);
  useEffect(() => {
    const interval = setInterval(() => {
      if (count === 0) {
        clearInterval(interval);
      } else {
        setCount(count - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [count]);
  const VerifyOTP = async () => {
    const otpCode = f1 + f2 + f3 + f4 + f5 + f6;
    const email = await AsyncStorage.getItem('userEmail');
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/verify-OTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpCode,
          email: email,
        }),
      });
      if (response.ok) {
        console.log('Mã OTP thành công');
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công',
          text2: 'Mã OTP hợp lệ',
        }); // Hiển thị thông báo thành công
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        console.error('OTP sai');
        const error = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Mã OTP',
          text2: error.message,
        }); // Hiển thị thông báo thành công
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
    }
  };
  //gửi lại OTP
  const handleResendOTP = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    try {
      // Gọi API để gửi lại mã OTP
      const response = await fetch(
        `${API_BASE}/api/v1/auth/send-register-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      if (response.ok) {
        setCount(60); // Cập nhật giá trị cho biến count
        setF1('');
        setF2('');
        setF3('');
        setF4('');
        setF5('');
        setF6('');
        Toast.show({
          type: 'info',
          text1: 'Mã OTP',
          text2: 'Gửi lại OTP thành công',
        });
      } else {
        // Xử lý khi gửi lại mã OTP thất bại
        const errorData = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Mã OTP',
          text2: 'Gửi lại OTP lỗi',
        });
      }
    } catch (error) {
      console.error('Error during resending OTP:', error);
    }
  };

  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('ForgotPassword')}>
        <Image source={require('../assets/icons/back-icon.png')} />
      </TouchableOpacity>
      <Image
        source={require('../assets/icons/Book_logos_black.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Mã OTP</Text>
      <View style={styles.inputContainer}>
        <TextInput
          ref={et1}
          value={f1}
          style={[
            styles.input,
            {borderColor: f1.length >= 1 ? '#3697A6' : '#000'},
          ]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={txt => {
            setF1(txt);
            if (txt.length >= 1) {
              et2.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et2}
          value={f2}
          style={[
            styles.input,
            {borderColor: f2.length >= 1 ? '#3697A6' : '#000'},
          ]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={txt => {
            setF2(txt);
            if (txt.length >= 1) {
              et3.current?.focus();
            } else if (txt.length < 1) {
              et1.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et3}
          value={f3}
          style={[
            styles.input,
            {borderColor: f3.length >= 1 ? '#3697A6' : '#000'},
          ]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={txt => {
            setF3(txt);
            if (txt.length >= 1) {
              et4.current?.focus();
            } else if (txt.length < 1) {
              et2.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et4}
          value={f4}
          style={[
            styles.input,
            {borderColor: f4.length >= 1 ? '#3697A6' : '#000'},
          ]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={txt => {
            setF4(txt);
            if (txt.length >= 1) {
              et5.current?.focus();
            } else if (txt.length < 1) {
              et3.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et5}
          value={f5}
          style={[
            styles.input,
            {borderColor: f5.length >= 1 ? '#3697A6' : '#000'},
          ]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={txt => {
            setF5(txt);
            if (txt.length >= 1) {
              et6.current?.focus();
            } else if (txt.length < 1) {
              et4.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et6}
          value={f6}
          style={[
            styles.input,
            {borderColor: f6.length >= 1 ? '#3697A6' : '#000'},
          ]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={txt => {
            setF6(txt);
            if (txt.length < 1) {
              et5.current?.focus();
            }
          }}
        />
      </View>
      <TouchableOpacity
        disabled={
          f1 !== '' &&
          f2 !== '' &&
          f3 !== '' &&
          f4 !== '' &&
          f5 !== '' &&
          f6 !== ''
            ? false
            : true
        }
        style={[
          styles.buttonSignUp,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor:
              f1 !== '' &&
              f2 !== '' &&
              f3 !== '' &&
              f4 !== '' &&
              f5 !== '' &&
              f6 !== ''
                ? '#3697A6'
                : 'gray',
          },
        ]}
        onPress={VerifyOTP}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
      <Text>
        Bạn chưa nhận được mã ? {''}
        <Text
          style={[styles.SignIntext, {display: count !== 0 ? 'none' : 'flex'}]}
          onPress={handleResendOTP}>
          Gửi lại
        </Text>
        {count !== 0 && (
          <Text style={{display: count === 0 ? 'none' : 'flex'}}>
            {' '}
            {''}
            {count}
          </Text>
        )}
      </Text>
      <Toast />
    </View>
  );
};
OTPPage.propTypes = {
  navigation: PropTypes.object.isRequired,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 35,
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
  },
  titlecontainer: {
    width: '100%',
    height: 70,
    lineHeight: 35,
    padding: 20,
    marginTop: 30,
  },
  SignIntext: {
    color: 'blue',
    fontWeight: 'bold',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  SkipText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
    fontFamily: 'Anta-Regular',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  buttonSignUp: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    marginTop: 24,
  },
  image: {
    marginTop: 15,
    height: 102,
    width: 244,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    width: 30,
    height: 30,
    padding: 10,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
export default OTPPage;
