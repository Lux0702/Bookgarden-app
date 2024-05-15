import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useUpdateAddress} from '../utils/api';
// import {useIsFocused} from '@react-navigation/native';
import {isLoggedIn} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import {CheckBox} from '@rneui/themed';

interface tokenProp {
  accessToken: string;
  refreshToken: string;
}
interface categoryProp {
  id: string;
  categoryName: string;
}
interface authorProp {
  id: string;
  authorName: string;
}
interface address {
  id: string;
  address: string;
  fullName: string;
  phone: string;
}
import {Swipeable} from 'react-native-gesture-handler';
const AddAddress = ({navigation, route}: any) => {
  let {IsChange, checkTokenExpiration} = useTokenExpirationCheck();
  const [token, setToken] = useState<tokenProp | null>(null);
  const [spining, setSpining] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const {addresses} = route.params || [];

  const login = isLoggedIn();
  console.log('Is logged in:', login);
  const {fetchUpdateAddress} = useUpdateAddress({token}, {navigation});
  //gettoken
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
    }, [IsChange]),
  );
  //Check token
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
    }, []),
  );
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const saveAddressToAsyncStorage = async () => {
  //       try {
  //         await AsyncStorage.setItem('address', JSON.stringify(asynAddress));
  //       } catch (error) {
  //         console.log('Error saving address to AsyncStorage:', error);
  //       }
  //     };
  //     saveAddressToAsyncStorage();
  //   }, [asynAddress]),
  // );
  const handleUploadAddress = async () => {
    let update = addresses?.map((data: address) => data.address) || [];
    update = [...update, address];
    try {
      setSpining(true);
      await fetchUpdateAddress(update);
      await AsyncStorage.setItem(
        'infoAddress',
        JSON.stringify({fullName, phone}),
      );
    } catch (error) {
      console.log('Lỗi cập nhật địa chỉ');
    } finally {
      setSpining(false);
      // navigation.replace('AddressPage');
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <Text style={styles.titleAdress}>Liên hệ</Text>
        <TextInput
          style={styles.inputContainer}
          placeholder="Tên người nhận"
          onChangeText={text => setFullName(text)}
          value={fullName}
        />
        <TextInput
          style={styles.inputContainer}
          placeholder="Số điện thoại người nhận"
          onChangeText={text => setPhone(text)}
          value={phone}
        />
        <Text style={styles.titleAdress}>Địa chỉ</Text>
        <TextInput
          style={styles.inputContainer}
          placeholder="Địa chỉ gửi hàng"
          onChangeText={text => setAddress(text)}
          value={address}
        />
        <TouchableOpacity onPress={() => handleUploadAddress()}>
          <Text style={styles.titleContainer}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF3333',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 90,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#33FF33',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 90,
    marginTop: 10,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#EFECEC',
    width: '100%',
  },
  addressContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 5,
    width: '100%',
  },
  checkboxText: {
    fontSize: 16,
    color: '#1F2A37',
    marginLeft: 5,
  },
  more: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'normal',
  },
  select: {
    width: '90%',
  },
  icon: {
    marginRight: 5,
    width: 30,
    height: 30,
    padding: 10,
    alignContent: 'center',
  },
  iconEdit: {
    marginRight: 5,
    width: 20,
    height: 20,
    alignContent: 'center',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3697A6',
    padding: 5,
    width: '90%',
    borderRadius: 24,
    textAlign: 'center',
    margin: 'auto',
    color: 'white',
  },
  NoneContent: {
    fontSize: 18,
    alignSelf: 'center',
    color: '#696969',
    marginTop: 30,
  },
  spinnerTextStyle: {
    color: 'black',
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
  addMore: {
    fontSize: 25,
    width: '100%',
    color: '#262626',
    textAlign: 'center',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    color: '#E01F1F',
    textAlign: 'center',
    fontWeight: '300',
    alignItems: 'center',
    justifyContent: 'center',
    fontStyle: 'italic',
    marginLeft: 5,
  },
  titleAdress: {
    fontSize: 20,
    width: '100%',
    color: '#262626',
    textAlign: 'left',
    fontWeight: '300',
    alignItems: 'center',
    justifyContent: 'center',
    fontStyle: 'italic',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  titleContainer: {
    marginTop: 5,
    width: '90%',
    flexDirection: 'row',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    backgroundColor: '#3697A6',
    borderRadius: 24,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    alignSelf: 'center',
  },
  edit: {
    marginTop: 2,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#EFECEC',
  },
  buy: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'column',
    textAlign: 'left',
  },
  address: {
    marginTop: 10,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'left',
    alignSelf: 'center',
  },
  editQuantity: {
    marginTop: 2,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 5,
    marginLeft: 15,
    height: 5,
  },
  divider: {
    marginTop: 10,
    height: 1,
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
    fontSize: 18,
  },
});

export default AddAddress;
