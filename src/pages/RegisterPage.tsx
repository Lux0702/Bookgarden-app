import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import validator from 'validator';
import tw from 'tailwind-react-native-classnames';
import {HelperText} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {API_BASE} from '../utils/utils';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [spining, setSpining] = useState(false);

  const signUp = async () => {
    setSpining(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName,
          email: email,
          phone: phone,
          passWord: password,
          confirmPassWord: confirmPassword,
        }),
      });
      if (response.ok) {
        console.log('Đăng ký thành công');
        console.log('chuyển hướng nhập mã OTP');
        AsyncStorage.setItem('userEmail', email);
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công',
          text2: 'Mã OTP đã gửi đến emai. vui lòng kiểm tra',
        }); // Hiển thị thông báo thành công
        setTimeout(() => {
          navigation.navigate('OTP');
        }, 2000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData
          ? errorData.message
          : 'Đăng kí thất bại. Vui lòng thử lại';
        console.log('Registration failed:', errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Đăng ký tài khoản',
          text2: errorMessage,
        });
      }
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setSpining(false);
    }
  };

  const signInWithGoogle = async () => {
    // try {
    //   const result = await Google.logInAsync({
    //     androidClientId: YOUR_CLIENT_ID,
    //     scopes: ['profile', 'email'],
    //   });
    //   if (result.type === 'success') {
    //     // handle successful sign-in
    //   } else {
    //     // handle error
    //   }
    // } catch (e) {
    //   // handle error
    // }
  };
  const handleEmailChange = ({text}: any) => {
    setEmail(text);
    setIsValidEmail(
      text.trim() !== '' && validator.isEmail(text) ? false : true,
    );
  };
  const handlePhoneChange = (text: any) => {
    setPhone(text);
    setIsValidPhone(
      text.length > 0 && validator.isMobilePhone(text) ? false : true,
    );
  };
  const handlePassWordChange = ({text}: any) => {
    setConfirmPassword(text);
    setIsPassword(
      text.trim() !== '' && text.trim() === password.trim() ? false : true,
    );
  };
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Image
        source={require('../assets/icons/Book_logos_black.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Tạo tài khoản</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/user.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên người dùng"
          value={fullName}
          onChangeText={text => setFullName(text)}
        />
      </View>
      <View style={[styles.helperText, !isValidEmail && {display: 'none'}]}>
        <HelperText type="error" visible={isValidEmail}>
          Email không hợp lệ
        </HelperText>
      </View>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/sms.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => handleEmailChange({text})}
        />
      </View>
      <View style={[styles.helperText, !isValidPhone && {display: 'none'}]}>
        <HelperText type="error" visible={isValidPhone}>
          Số điện thoại không hợp lệ
        </HelperText>
      </View>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/call.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          keyboardType="number-pad"
          onChangeText={text => handlePhoneChange(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/lock.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={[styles.helperText, !isPassword && {display: 'none'}]}>
        <HelperText type="error" visible={isPassword}>
          Mật khẩu không khớp
        </HelperText>
      </View>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/lock.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={text => handlePassWordChange({text})}
        />
      </View>
      <TouchableOpacity
        disabled={
          fullName !== '' &&
          email !== '' &&
          password !== '' &&
          confirmPassword !== ''
            ? false
            : true
        }
        style={[
          styles.buttonSignUp,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor:
              fullName !== '' &&
              email !== '' &&
              password !== '' &&
              confirmPassword !== ''
                ? '#3697A6'
                : 'gray',
          },
        ]}
        onPress={signUp}>
        <Text style={styles.buttonText}>Đăng kí tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Image
          style={styles.googleIcon}
          source={require('../assets/icons/Google.png')}
        />
        <Text style={styles.googleText}>Đăng nhập với Google</Text>
      </TouchableOpacity>
      <Text>
        Bạn đã có tài khoản?{' '}
        <Text
          style={styles.SignIntext}
          onPress={() => navigation.navigate('Login')}>
          Đăng nhập
        </Text>
      </Text>
      <Text style={styles.SkipText}>Bỏ qua</Text>
      <Spinner
        visible={spining}
        textContent={'Đang xử lí...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  helperText: {
    width: '90%',
    textAlign: 'left',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '90%',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    marginLeft: 24,
    marginRight: 24,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
    paddingHorizontal: 10,
  },
  SignIntext: {
    color: 'blue',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  SkipText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
    fontFamily: 'Times',
  },
  input: {
    height: 50,
    color: '#9CA3AF',
  },
  buttonSignUp: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
    borderRadius: 25,
  },
  googleButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderBlockColor: '#FFC107',
    color: 'black',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    width: '90%',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  googleText: {
    color: 'black',
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    marginTop: 24,
  },
  image: {
    marginTop: 60,
    height: 102,
    width: 244,
    marginBottom: 20,
  },
  googleIcon: {
    marginRight: 10,
    width: 30,
    height: 30,
    padding: 10,
  },
  icon: {
    marginRight: 10,
    width: 30,
    height: 30,
    padding: 10,
  },
});
