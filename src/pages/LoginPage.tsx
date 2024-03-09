import React, {useState} from 'react';
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
import {addUser} from '../service/AuthService';

export default function LoginPage({navigation}: {navigation: any}) {
  const [passWord, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const Login = async () => {
    console.log('email: ', email);
    console.log('password : ', passWord);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, passWord}),
      });
      if (response.ok) {
        console.log('Đăng nhập thành công');
        addUser(email, email, passWord);
        navigation.navigate('Home');
      } else {
        console.error('Đăng nhập không thành công');
      }
    } catch (error) {
      console.error('Lỗi:', error);
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

  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Image
        source={require('../assets/icons/Book_logos_black.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Đăng nhập</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/sms.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email đăng nhập"
          value={email}
          onChangeText={text => setEmail(text)}
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
          value={passWord}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.buttonSignUp} onPress={Login}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Image
          style={styles.googleIcon}
          source={require('../assets/icons/Google.png')}
        />
        <Text style={styles.googleText}>Đăng nhập với Google</Text>
      </TouchableOpacity>
      <Text
        style={styles.SignIntext}
        onPress={() => navigation.navigate('Register')}>
        Quên mật khẩu ?
      </Text>
      <Text>
        Bạn chưa có tài khoản ?
        <Text
          style={styles.SignIntext}
          onPress={() => navigation.navigate('Register')}>
          Đăng ký tại đây
        </Text>
      </Text>
      <Text style={styles.SkipText} onPress={() => navigation.navigate('Home')}>
        Bỏ qua
      </Text>
    </View>
  );
}
LoginPage.propTypes = {
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
  // containerInput: {
  //   flexDirection: 'row',
  //   paddingHorizontal: 12,
  //   paddingVertical: 12,
  //   height: 50,
  //   width: '100%',
  //   marginBottom: 12,
  //   paddingLeft: 8,
  //   marginLeft: 24,
  //   marginRight: 24,
  // },
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
    paddingHorizontal: 12,
    paddingVertical: 12,
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
