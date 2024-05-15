/* eslint-disable react-native/no-inline-styles */
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
// import tw from 'tailwind-react-native-classnames';
// import {API_BASE} from '../utils/utils';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useCartData, useOrder, useProfileData} from '../utils/api';
// import {useIsFocused} from '@react-navigation/native';
import {isLoggedIn} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {useFocusEffect, useNavigationState} from '@react-navigation/native';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
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
const OrderPage = ({navigation, route}: any) => {
  const {order} = route.params || [];
  const {buyNow} = route.params || [];
  const {buyQuantity} = route.params || null;
  const {cartItem} = route.params || [];
  console.log('cartItem order:', cartItem);

  let totalPrice = 0;
  let {IsChange, checkTokenExpiration} = useTokenExpirationCheck();
  const navigationState = useNavigationState(state => state);
  const isCartPageTabFocused =
    navigationState.index === 1 &&
    navigationState.routes[navigationState.index].name === 'Giỏ hàng';
  console.log('focus:', isCartPageTabFocused);
  const [token, setToken] = useState<tokenProp | null>(null);
  const flatListRef = useRef(null);
  const [spining, setSpining] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [visibleCartPage, setVisibleCartPage] = useState(10);
  const [visible, setVisible] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState(0);
  const [payMethod, setPayMethod] = useState('');
  const [selectAddress, setSelectAddress] = useState<address>();
  const {
    userData,
    fetchProfileData,
  }: {userData: any; fetchProfileData: () => void} = useProfileData({
    token,
  });
  const login = isLoggedIn();
  console.log('Is logged in:', login);
  const {cart, fetchCart}: {cart: any; fetchCart: () => void} = useCartData({
    token,
  });
  const {fetchOrderCart} = useOrder({token});
  if (order) {
    order.forEach((item: {quantity: number; book: {price: number}}) => {
      totalPrice += item.quantity * item.book.price;
    });
  }
  if (buyNow) {
    totalPrice += buyQuantity * buyNow.price;
  }
  useEffect(() => {
    if (login) {
      checkTokenExpiration();
    }
  }, []);
  useEffect(() => {
    const getTokenAndFetchData = async () => {
      try {
        setSpining(true);
        const tokenFromStorage = await AsyncStorage.getItem('token');
        if (tokenFromStorage) {
          const parsedToken = JSON.parse(tokenFromStorage);
          setToken(parsedToken); // Cập nhật state token với giá trị từ AsyncStorage
          console.log('Token', parsedToken);
        }
      } catch (error) {
        console.log('Error fetching token or data:', error);
      } finally {
        setSpining(false);
      }
    };
    getTokenAndFetchData();
  }, [IsChange]);

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (login) {
        try {
          setSpining(true);
          await fetchCart();
          setIsDelete(false);
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
  }, [isCartPageTabFocused, isDelete, token]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchDataIfNeeded = async () => {
        if (login) {
          try {
            setSpining(true);
            await fetchProfileData();
            const address = await AsyncStorage.getItem('selectAddress');
            if (address) {
              setSelectAddress(JSON.parse(address) || '');
            }
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
    }, [token]),
  );
  const loadMoreCartPage = () => {
    try {
      setSpining(true);
      setVisibleCartPage(prevVisibleCartPage => prevVisibleCartPage + 10);
    } catch {
      console.log('error setVisibleCartPage');
    } finally {
      setSpining(false);
    }
  };
  const handleBookPress = useCallback(
    (_id: string) => {
      console.log('id navigation: ', _id);
      navigation.navigate('BookDetail', {bookId: _id});
    },
    [navigation],
  );
  const formatCurrency = (amount: number | undefined) => {
    if (amount !== undefined) {
      return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    } else {
      return '';
    }
  };
  //   const handleQuantityChange = async (id: id, quantity: number) => {
  //     if (quantity === 0) {
  //       handleDeleteCartItem(id);
  //     } else {
  //       try {
  //         setSpining(true);
  //         await fetchUploadCartItem({bookId: id, quantity: quantity});
  //         setIsDelete(true);
  //       } catch (error) {
  //         console.log('Error handleQuantityChange :>> ', error);
  //       } finally {
  //         setSpining(false);
  //       }
  //     }
  //   };
  //   const handleGetOrder = () => {};
  const handleOrder = async () => {
    const info = {
      fullName: selectAddress ? selectAddress.fullName : userData.fullName,
      phone: selectAddress ? selectAddress.phone : userData.phone,
      address: selectAddress
        ? selectAddress.address
        : userData?.addresses?.[0]?.address,
      payMethod: payMethod,
      totalPrice: totalPrice + deliveryMethod,
    };
    try {
      setSpining(true);
      await fetchOrderCart({
        cartItem: cartItem,
        info: info,
      });
      setIsDelete(true);
    } catch (error) {
      console.log('Lỗi order rồi:', error);
    } finally {
      setSpining(false);
      navigation.goBack();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buy}>
        <View style={styles.address}>
          <Image source={require('../assets/icons/location.png')} />
          <Text style={styles.titleAdress}>Địa chỉ nhận hạng</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddressPage', {
              userAddress: userData,
              selectID: selectAddress?.id,
            });
            console.log('userData', userData);
          }}>
          <Image
            source={require('../assets/icons/arrow-right.png')}
            style={styles.iconEdit}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.titleAdress}>
        {selectAddress
          ? `${selectAddress.fullName} | ${selectAddress.phone}`
          : `${userData?.fullName || ''} ${
              userData?.phone ? `| ${userData.phone}` : ''
            }`}
      </Text>
      <Text style={styles.titleAdress} numberOfLines={2} ellipsizeMode="tail">
        {selectAddress
          ? selectAddress.address
          : userData?.addresses?.[0]?.address}
      </Text>

      <View style={styles.select}>
        <Text style={styles.titleAdress}>Phương thức vận chuyển</Text>
        <RNPickerSelect
          onValueChange={value => setDeliveryMethod(value)}
          items={[
            {label: 'Hỏa tốc', value: 30000},
            {label: 'Thường', value: 15000},
          ]}
          placeholder={{label: 'Chọn phương thức vận chuyển', value: null}}
        />
        <Text style={styles.titleAdress}>Phương thức thanh toán</Text>
        <RNPickerSelect
          onValueChange={value => setPayMethod(value)}
          items={[
            {label: 'Thanh toán khi nhận hàng', value: 'ON_DELIVERY'},
            {label: 'Thanh toán trực tuyến', value: 'ONLINE'},
          ]}
          placeholder={{label: 'Chọn phương thức thanh toán', value: null}}
        />
      </View>
      <View style={styles.buy}>
        <Text style={styles.checkboxText}>
          Tổng tiền:{' '}
          {buyQuantity
            ? formatCurrency(buyQuantity * buyNow.price + deliveryMethod)
            : formatCurrency(totalPrice + deliveryMethod)}
        </Text>
        <TouchableOpacity
          style={[
            styles.buttonLogout,
            {backgroundColor: payMethod && deliveryMethod ? '#3697A6' : '#ccc'},
          ]}
          disabled={!(payMethod && deliveryMethod)}
          onPress={() => {
            handleOrder();
          }}>
          <Text style={[styles.title]}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
      {buyNow && buyQuantity ? (
        <ScrollView>
          <View pointerEvents="none">
            <TouchableOpacity key={buyNow._id}>
              <View style={styles.carousell}>
                <View style={styles.BookDetail}>
                  <Image
                    style={styles.imagebook}
                    source={
                      buyNow.image !== ''
                        ? {uri: buyNow.image}
                        : require('../assets/images/Bookcover.png')
                    }
                  />
                  <Image
                    style={styles.iconWish}
                    source={require('../assets/icons/wish.png')}
                  />
                  <View style={styles.detail}>
                    <Text
                      style={styles.titleBook}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {buyNow.title}
                    </Text>
                    <Text
                      style={styles.price}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {formatCurrency(buyNow.price)}
                    </Text>
                    <Divider style={styles.divider} />
                    <View style={styles.categoryContainer}>
                      {buyNow &&
                        buyNow.categories.length > 0 &&
                        buyNow.categories.map((category: categoryProp) => (
                          <Text
                            key={category.id}
                            style={styles.textCategory}
                            numberOfLines={1}>
                            {category.categoryName}
                          </Text>
                        ))}
                    </View>
                    <Text
                      style={[styles.price, {width: 200}]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {buyNow &&
                        buyNow.authors
                          .map((author: authorProp) => author.authorName)
                          .join(', ')}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.editQuantity}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={styles.price}>Số lượng :</Text>
                <Text style={styles.price}>{buyQuantity}</Text>
              </View>
              <View style={styles.quantityControl} pointerEvents="none">
                <Text style={[styles.price, {fontWeight: 'bold'}]}>
                  Tổng tiền: {formatCurrency(buyQuantity * buyNow.price)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : login && Object.keys(cart).length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={order ? order.slice(0, visibleCartPage) : []}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <View pointerEvents="none">
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  handleBookPress(item._id);
                }}>
                <View style={styles.carousell}>
                  <View style={styles.BookDetail}>
                    <Image
                      style={styles.imagebook}
                      source={
                        item.book.image !== ''
                          ? {uri: item.book.image}
                          : require('../assets/images/Bookcover.png')
                      }
                    />
                    <Image
                      style={styles.iconWish}
                      source={require('../assets/icons/wish.png')}
                    />
                    <View style={styles.detail}>
                      <Text
                        style={styles.titleBook}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {item.book.title}
                      </Text>
                      <Text
                        style={styles.price}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {formatCurrency(item.book.price)}
                      </Text>
                      <Divider style={styles.divider} />
                      <View style={styles.categoryContainer}>
                        {item &&
                          item.book.categories.length > 0 &&
                          item.book.categories.map((category: categoryProp) => (
                            <Text
                              key={category.id}
                              style={styles.textCategory}
                              numberOfLines={1}>
                              {category.categoryName}
                            </Text>
                          ))}
                      </View>
                      <Text
                        style={[styles.price, {width: 200}]}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {item &&
                          item.book.authors
                            .map((author: authorProp) => author.authorName)
                            .join(', ')}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.editQuantity}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={styles.price}>Số lượng :</Text>
                  <Text style={styles.price}>{item.quantity}</Text>
                </View>
                <View style={styles.quantityControl} pointerEvents="none">
                  <Text style={[styles.price, {fontWeight: 'bold'}]}>
                    Tổng tiền: {formatCurrency(item.quantity * item.book.price)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          onEndReached={loadMoreCartPage}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <View>
          <Text style={styles.NoneContent}>Chưa có sản phẩm</Text>
          <Image source={require('../assets/images/cart_empty_icon.png')} />
          <TouchableOpacity
            style={[styles.buttonGoBuy]}
            onPress={() => {
              navigation.navigate('ListBook');
            }}>
            <Text style={styles.title}>Xem sản phẩm</Text>
          </TouchableOpacity>
        </View>
      )}

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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 5,
  },
  checkboxText: {
    fontSize: 16,
    color: '#1F2A37',
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
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginTop: 2,
    height: 0.5,
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

export default OrderPage;
