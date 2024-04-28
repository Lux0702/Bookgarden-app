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
import {API_BASE} from '../utils/utils';
import {addUser} from '../service/AuthService';
import {useNavigation} from '@react-navigation/native';
import { index } from 'realm';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const handleForgotPassword = async () => {
    console.log('email: ', email);
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('Login')}>
        <Image source={require('../assets/icons/back-icon.png')} />
      </TouchableOpacity>
      <View style={styles.container}>
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
        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    top: -80,
  },
  titlecontainer: {
    width: '100%',
    height: 60,
    lineHeight: 35,
    padding: 24,
    flexDirection: 'row',
    position: 'relative',
    top: 30,
    zIndex: 1,
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    marginTop: 24,
  },
  image: {
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
