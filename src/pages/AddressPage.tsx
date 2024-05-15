/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useProfileData, useUpdateAddress} from '../utils/api';
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
// interface categoryProp {
//   id: string;
//   categoryName: string;
// }
// interface authorProp {
//   id: string;
//   authorName: string;
// }
interface address {
  id: string;
  address: string;
  fullName: string;
  phone: string;
}
import {Swipeable} from 'react-native-gesture-handler';
const AddressPage = ({navigation, route}: any) => {
  let {IsChange, checkTokenExpiration} = useTokenExpirationCheck();
  const [token, setToken] = useState<tokenProp | null>(null);
  const [spining, setSpining] = useState(false);
  const [visible, setVisible] = useState(false);
  const [addressSelect, SetAddressSelect] = useState<address>();

  const {
    userData,
    fetchProfileData,
  }: {userData: any; fetchProfileData: () => void} = useProfileData({
    token,
  });
  let {userAddress} = route.params || [];
  if (!userAddress) {
    userAddress = userData;
    console.log('dia chi moi la,', userAddress);
  }
  const {selectID} = route.params || [];
  console.log('selectID:', selectID);
  const [selectedIndex, setIndex] = React.useState<string>(selectID || null);
  let [asynAddress, setAsyncAddress] = useState<address[]>([]);
  const login = isLoggedIn();
  console.log('Is logged in:', login);
  const {fetchUpdateAddress} = useUpdateAddress({token}, {navigation});
  // useEffect(() => {
  //   AsyncStorage.removeItem('address');
  // });
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
        } finally {
          await checkTokenExpiration();
        }
      };
      getTokenAndFetchData();
    }, [IsChange]),
  );
  //Check token
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchData = async () => {
  //       try {
  //         await checkTokenExpiration();
  //       } catch (error) {
  //         console.log('Lỗi kiểm tra token:', error);
  //       }
  //     };
  //     fetchData();
  //   }, []),
  // );
  useFocusEffect(
    React.useCallback(() => {
      const fetchDataIfNeeded = async () => {
        if (login) {
          try {
            setSpining(true);
            await fetchProfileData();
          } catch (error) {
            console.log('Error fetch:', error);
          } finally {
            setSpining(false);
          }
        }
      };
      fetchDataIfNeeded();
    }, [token]),
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchAndUpdateAddresses = async () => {
        console.log('userData gui:', userAddress);
        try {
          setSpining(true);
          // Fetch user data addresses
          const newData = userAddress?.addresses.map(
            (address: {id: string; address: string}) => {
              return {
                id: address.id,
                address: address.address,
                fullName: userAddress.fullName || '',
                phone: userAddress.phone || '',
              };
            },
          );
          console.log('newData gui:', newData);
          // Fetch addresses from AsyncStorage
          const address = await AsyncStorage.getItem('address');
          const info = await AsyncStorage.getItem('infoAddress');
          const {fullName, phone} = JSON.parse(info || '');
          console.log('full and phone:', fullName, phone);
          let parsedAddress = JSON.parse(address || '[]');
          console.log('parsedAddress gui:', parsedAddress);
          // Update local addresses if async addresses exist
          if (parsedAddress.length > 0) {
            console.log('asynAddress có');
            console.log('asynAddress có là', parsedAddress);
            parsedAddress.forEach((item: any) => {
              newData.forEach((addressItem: any) => {
                if (item.id === addressItem.id) {
                  item.address = addressItem.address;
                  item.fullName = item.fullName
                    ? item.fullName
                    : addressItem.fullName;
                  item.phone = item.phone ? item.phone : addressItem.phone;
                }
              });
            });
            newData.forEach((addressItem: any) => {
              const isNewItem = parsedAddress.find(
                (item: any) => item.id === addressItem.id,
              );
              if (!isNewItem) {
                let newitem = addressItem;
                if (phone && fullName) {
                  newitem.phone = phone;
                  newitem.fullName = fullName;
                  console.log('new address la:', newitem);
                }
                parsedAddress.push(newitem);
              }
            });
            setAsyncAddress(parsedAddress);
            console.log('khởi tạo address');
            await AsyncStorage.setItem(
              'address',
              JSON.stringify(parsedAddress),
            );
          } else {
            setAsyncAddress(newData);
            await AsyncStorage.setItem('address', JSON.stringify(newData));
          }
        } catch (error) {
          console.log('Error fetching data:', error);
        } finally {
          setSpining(false);
        }
      };

      fetchAndUpdateAddresses();
    }, [userAddress]),
  );
  const handleEditAddress = (address: address) => {
    console.log('data address send: ', userAddress?.addresses);
    navigation.navigate('EditAddress', {
      addresses: address,
      ListAddresses: userAddress?.addresses || [],
    });
  };
  const titleAddress = (address: address) => {
    return (
      <View style={styles.addressContainer}>
        <Text
          style={styles.checkboxText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {address.fullName} | {address.phone}
        </Text>
        <Text
          style={styles.checkboxText}
          numberOfLines={2}
          ellipsizeMode="tail">
          {address.address}
        </Text>
      </View>
    );
  };
  const rightSwiple = (address: address) => {
    return (
      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            handleDeleteAddress(address);
          }}>
          <Text style={styles.title}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            handleEditAddress(address);
          }}>
          <Text style={styles.title}>Sửa</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const handleDeleteAddress = async (address: address) => {
    // console.log('1 address:', address.id);
    // console.log('2 address:', userAddress?.addresses);
    const data =
      userAddress?.addresses?.filter(
        (dataAddress: address) =>
          dataAddress.id !== address.id && dataAddress.address,
      ) || [];
    let update = data?.map((dataAddress: address) => dataAddress.address);
    console.log('edit address:', update);
    try {
      setSpining(true);
      await fetchUpdateAddress(update);
      await AsyncStorage.setItem('address', JSON.stringify(data));
    } catch (error) {
      console.log('Lỗi cập nhật địa chỉ');
    } finally {
      setSpining(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buy}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          {asynAddress &&
            asynAddress.length > 0 &&
            asynAddress.map((address: address) => (
              <Swipeable
                key={address.id}
                renderRightActions={() => rightSwiple(address)}>
                <CheckBox
                  title={titleAddress(address)}
                  checked={selectedIndex === address.id}
                  onPress={() => {
                    setIndex(address.id);
                    SetAddressSelect(address);
                    AsyncStorage.setItem(
                      'selectAddress',
                      JSON.stringify(address),
                    );
                  }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                />
              </Swipeable>
            ))}

          <TouchableOpacity
            style={styles.addMore}
            onPress={() =>
              navigation.navigate('AddAddress', {
                addresses: userAddress?.addresses || [],
              })
            }>
            <Image source={require('../assets/icons/addMore.png')} />
            <Text style={styles.title}>Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
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
            <Text style={styles.titleModal}>Thông báo</Text>
            <Divider />
            <Text style={[styles.title, {marginTop: 20}]}>
              Bạn cần phải đăng nhập để xem
            </Text>
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.buttonLogout, {backgroundColor: '#ccc'}]}
                onPress={() => {
                  setVisible(false);
                  navigation.replace('Home');
                }}>
                <Text style={styles.title}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonLogout}
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text style={styles.title}>Có</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  quantityControl: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 40,
  },
  quantityButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  quantity: {
    width: 70,
    height: 40,
    textAlign: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 20,
    alignSelf: 'center',
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
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
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
    color: 'black',
    textAlign: 'center',
    fontWeight: '300',
    alignItems: 'center',
    justifyContent: 'center',
    fontStyle: 'italic',
    marginLeft: 5,
    fontFamily: 'bold',
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
  },
  iconWish: {
    position: 'absolute',
    top: 12,
    left: 100,
    width: 27,
    height: 27,
    resizeMode: 'contain',
    zIndex: 1,
  },
  titleContainer: {
    marginTop: 5,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 18,
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    margin: 5,
    justifyContent: 'space-between',
    paddingTop: 0,
    overflow: 'hidden',
    maxHeight: 77,
  },
  textCategory: {
    fontSize: 13,
    height: 'auto',
    width: 80,
    color: '#262626',
    borderRadius: 45,
    borderColor: 'black',
    backgroundColor: '#ccc',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '700',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  carousell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 10,
    marginLeft: 20,
  },
  BookDetail: {
    flexDirection: 'row',
    width: 365,
    height: 200,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 8,
  },
  imagebook: {
    width: 130,
    height: 200,
    marginTop: 0,
    borderRadius: 8,
  },
  price: {
    fontWeight: 'normal',
    color: '#6B7280',
    alignItems: 'flex-start',
    margin: 5,
  },
  detail: {
    padding: 10,
  },
  titleBook: {
    width: 200,
    fontSize: 21,
    color: '#262626',
    fontWeight: '700',
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
  buttonLogout: {
    width: '40%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 5,
    borderRadius: 25,
  },
  buttonGoBuy: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default AddressPage;
