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
} from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// import {API_BASE} from '../utils/utils';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useCartData, useDeleteCartItem, useUploadCartItem} from '../utils/api';
// import {useIsFocused} from '@react-navigation/native';
import {isLoggedIn} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {useNavigationState} from '@react-navigation/native';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import {CheckBox} from '@rneui/themed';
import Toast from 'react-native-toast-message';
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
interface id {
  id: string;
}
const CartPage = ({navigation}: any) => {
  let {Ischange, checkTokenExpiration} = useTokenExpirationCheck();
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
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const login = isLoggedIn();
  console.log('Is logged in:', login);
  const [selectedbooks, setSelectedBooks] = useState<string[]>([]);
  const {cart, fetchCart}: {cart: any; fetchCart: () => void} = useCartData({
    token,
  });
  const {fetchDeleteCartItem} = useDeleteCartItem({token});
  const {fetchUploadCartItem} = useUploadCartItem({token});
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
  }, [Ischange]);

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
  }, [isCartPageTabFocused, isDelete, token, navigation]);
  useEffect(() => {
    if (isCartPageTabFocused) {
      if (flatListRef.current) {
        (flatListRef.current as any).scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
    }
  }, [isCartPageTabFocused]);
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
  const isItemChecked = (itemId: string) => selectedbooks.includes(itemId);
  // Hàm xử lý khi nhấn vào checkbox "Chọn tất cả"
  const handleSelectAll = () => {
    setSelectAllChecked(!selectAllChecked);
    setSelectedBooks(selectAllChecked ? [] : cart.map((item: any) => item._id));
  };
  const handleItemCheckboxPress = (itemId: string) => {
    if (isItemChecked(itemId)) {
      setSelectedBooks(prev => prev.filter(id => id !== itemId));
    } else {
      setSelectedBooks(prev => [...prev, itemId]);
    }
  };
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
  const handleDeleteCartItem = async (id: any) => {
    try {
      setSpining(true);
      await fetchDeleteCartItem(id);
      setIsDelete(true);
    } catch (error) {
      console.log('Lỗi xóa:', error);
    } finally {
      setSpining(false);
    }
  };
  const handleQuantityChange = async (id: id, quantity: number) => {
    if (quantity === 0) {
      handleDeleteCartItem(id);
    } else {
      try {
        setSpining(true);
        await fetchUploadCartItem({bookId: id, quantity: quantity});
        setIsDelete(true);
      } catch (error) {
        console.log('Error handleQuantityChange :>> ', error);
      } finally {
        setSpining(false);
      }
    }
  };
  const handleGetOrder = () => {
    const filteredCart = cart.filter((item: any) =>
      selectedbooks.includes(item._id),
    );
    navigation.navigate('OrderPage', {
      order: filteredCart,
      cartItem: selectedbooks,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.buy}>
        <CheckBox
          checked={selectAllChecked}
          onPress={handleSelectAll}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
          containerStyle={styles.checkboxContainer}
          title={'Chọn tất cả'}
        />
        <TouchableOpacity
          style={styles.buttonLogout}
          onPress={() => {
            handleGetOrder();
          }}>
          <Text style={styles.title}>Mua hàng</Text>
        </TouchableOpacity>
      </View>
      {login && Object.keys(cart).length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={cart ? cart.slice(0, visibleCartPage) : []}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => {
            return (
              <View>
                <View style={styles.edit}>
                  <CheckBox
                    key={item._id}
                    checked={isItemChecked(item._id)}
                    onPress={() => handleItemCheckboxPress(item._id)}
                    iconType="material-community"
                    checkedIcon="checkbox-outline"
                    uncheckedIcon={'checkbox-blank-outline'}
                    containerStyle={styles.checkboxContainer}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      handleDeleteCartItem(item._id);
                    }}>
                    <Image
                      style={{
                        padding: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                      }}
                      source={require('../assets/icons/trash.png')}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  key={item._id}
                  onPress={() => {
                    handleBookPress(item.book._id);
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
                            item.book.categories.map(
                              (category: categoryProp) => (
                                <Text
                                  key={category.id}
                                  style={styles.textCategory}
                                  numberOfLines={1}>
                                  {category.categoryName}
                                </Text>
                              ),
                            )}
                        </View>
                        {/* <Divider style={styles.divider} /> */}
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
                    <Text style={styles.price}>Hàng còn :</Text>
                    <Text style={styles.price}>{item.book?.stock}</Text>
                  </View>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleQuantityChange(item.book._id, item.quantity - 1)
                      }>
                      <Text style={{fontSize: 20}}>--</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantity}
                      value={item.quantity.toString()}
                      onChangeText={text => {
                        const numberValue = parseFloat(text);
                        handleQuantityChange(item.book._id, numberValue);
                      }}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleQuantityChange(item.book._id, item.quantity + 1)
                      }>
                      <Text style={{fontSize: 20}}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 70,
  },
  more: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'normal',
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
    width: '45%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
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

export default CartPage;
