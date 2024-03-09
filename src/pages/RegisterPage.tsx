import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
// import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
export default function RegisterPage({navigation}: {navigation: any}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //const navigation = useNavigation();
  const signUp = () => {
    // sign up logic here
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
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icons/sms.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
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
          value={password}
          onChangeText={text => setPassword(text)}
        />
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
          onChangeText={text => setConfirmPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.buttonSignUp} onPress={signUp}>
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
    </View>
  );
}
RegisterPage.propTypes = {
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
