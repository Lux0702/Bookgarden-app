/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// import {API_BASE} from '../utils/utils';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useHistoryData, useReview} from '../utils/api';
import {Rating} from 'react-native-ratings';
import {isLoggedIn} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {useFocusEffect, useNavigationState} from '@react-navigation/native';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import Toast from 'react-native-toast-message';
import {Tab, TabView} from '@rneui/themed';
import Textarea from 'react-native-textarea';

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
interface Book {
  _id: string;
  title: string;
  image: any;
  price: number;
  soldQuantity: number;
  description: string;
  stock: number;
  publisher: string;
  publishedDate: string;
  language: string;
  pageNumbers: string;
  isbn: string;
  categories: [{id: string; categoryName: string}];
  authors: [{id: string; authorName: string}];
  reviews: [
    {
      id: string;
      user: {
        id: string;
        fullname: string;
        avatar: string;
      };
      review: string;
      rating: number;
    },
  ];
}
interface CartProp {
  _id: string;
  book: Book;
  quantity: number;
}
interface historyProp {
  _id: string;
  user: string;
  totalAmount: number;
  orderItems: CartProp[];
  fullName: string;
  address: string;
  phone: string;
  status: string;
  orderDate: string;
  paymentMethod: string;
  paymentDate: string;
  paymentAmount: number;
  paymentStatus: string;
}
const HistoryPage = ({navigation, route}: any) => {
  const {order} = route.params || [];
  const {cartItem} = route.params || [];

  let totalPrice = 0;
  let {checkTokenExpiration}: {checkTokenExpiration: () => void} =
    useTokenExpirationCheck();
  const navigationState = useNavigationState(state => state);
  const isCartPageTabFocused =
    navigationState.index === 1 &&
    navigationState.routes[navigationState.index].name === 'Giỏ hàng';
  console.log('focus:', isCartPageTabFocused);
  const [token, setToken] = useState<tokenProp | null>(null);
  const [spining, setSpining] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [visibleCartPage, setVisibleCartPage] = useState(10);
  const [visible, setVisible] = useState(false);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const login = isLoggedIn();
  console.log('Is logged in:', login);
  const [selectedbooks, setSelectedBooks] = useState<string[]>([]);
  const [Pending, setPending] = useState<historyProp[]>([]);
  const [Processing, setProcessing] = useState<historyProp[]>([]);
  const [Delivering, setDelivering] = useState<historyProp[]>([]);
  const [Delivered, setDelivered] = useState<historyProp[]>([]);
  const [Canceled, setCanceled] = useState<historyProp[]>([]);

  const {historyOrder, fetcHistoryOrder} = useHistoryData({token});
  const [index, setIndex] = React.useState(0);
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
  }, []);

  // useEffect(() => {
  //   const fetchDataIfNeeded = async () => {
  //     if (login) {
  //       try {
  //         setSpining(true);
  //         await fetcHistoryOrder();
  //         setIsDelete(false);
  //       } catch (error) {
  //         console.log('Error fetch:', error);
  //       } finally {
  //         const pendingOrders = Array.isArray(historyOrder)
  //           ? historyOrder.filter(
  //               (data: historyProp) => data.status === 'PENDING',
  //             )
  //           : [];
  //         const processingOrders = Array.isArray(historyOrder)
  //           ? historyOrder.filter(
  //               (data: historyProp) => data.status === 'PROCESSING',
  //             )
  //           : [];
  //         const deliveringders = Array.isArray(historyOrder)
  //           ? historyOrder.filter(
  //               (data: historyProp) => data.status === 'DELIVERING',
  //             )
  //           : [];
  //         const deliveredOrders = Array.isArray(historyOrder)
  //           ? historyOrder.filter(
  //               (data: historyProp) => data.status === 'DELIVERED',
  //             )
  //           : [];
  //         const canceledOrders = Array.isArray(historyOrder)
  //           ? historyOrder.filter(
  //               (data: historyProp) => data.status === 'CANCELLED',
  //             )
  //           : [];
  //         setPending(pendingOrders);
  //         setProcessing(processingOrders);
  //         setDelivered(deliveredOrders);
  //         setDelivering(deliveredOrders);
  //         setCanceled(canceledOrders);
  //         setSpining(false);
  //       }
  //     } else if (!login) {
  //       setVisible(true);
  //     }
  //   };
  //   fetchDataIfNeeded();
  //   console.log('Data order history:', historyOrder);
  // }, [isCartPageTabFocused, isDelete, token]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchDataIfNeeded = async () => {
        if (login) {
          try {
            setSpining(true);
            await fetcHistoryOrder();
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

      console.log('Data history order:', historyOrder);
    }, [token, index]),
  );
  useEffect(() => {
    const fetchDataOrder = async () => {
      try {
        setSpining(true);
        const pendingOrders = Array.isArray(historyOrder)
          ? historyOrder.filter(
              (data: historyProp) => data.status === 'PENDING',
            )
          : [];
        const processingOrders = Array.isArray(historyOrder)
          ? historyOrder.filter(
              (data: historyProp) => data.status === 'PROCESSING',
            )
          : [];
        const deliveringorders = Array.isArray(historyOrder)
          ? historyOrder.filter(
              (data: historyProp) => data.status === 'DELIVERING',
            )
          : [];
        const deliveredOrders = Array.isArray(historyOrder)
          ? historyOrder.filter(
              (data: historyProp) => data.status === 'DELIVERED',
            )
          : [];
        const canceledOrders = Array.isArray(historyOrder)
          ? historyOrder.filter(
              (data: historyProp) => data.status === 'CANCELLED',
            )
          : [];
        console.log('pending la:', pendingOrders[3]?.orderItems[0]?._id);
        await setPending(pendingOrders);
        await setProcessing(processingOrders);
        await setDelivered(deliveredOrders);
        await setDelivering(deliveringorders);
        await setCanceled(canceledOrders);
      } catch (error) {
        console.log('error:', error);
      } finally {
        setSpining(false);
      }
    };
    if (historyOrder) {
      fetchDataOrder();
    }
  }, [historyOrder]);
  // const loadMoreCartPage = () => {
  //   try {
  //     setSpining(true);
  //     setVisibleCartPage(prevVisibleCartPage => prevVisibleCartPage + 10);
  //   } catch {
  //     console.log('error setVisibleCartPage');
  //   } finally {
  //     setSpining(false);
  //   }
  // };
  // const handleBookPress = useCallback(
  //   (_id: string) => {
  //     console.log('id navigation: ', _id);
  //     navigation.navigate('BookDetail', {bookId: _id});
  //   },
  //   [navigation],
  // );
  // const formatCurrency = (amount: number | undefined) => {
  //   if (amount !== undefined) {
  //     return amount.toLocaleString('vi-VN', {
  //       style: 'currency',
  //       currency: 'VND',
  //     });
  //   } else {
  //     return '';
  //   }
  // };
  return (
    <View style={styles.container}>
      {/* <View style={styles.buy}>
        <Text style={styles.checkboxText}>
          Tổng tiền: {formatCurrency(totalPrice)}
        </Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={() => {}}>
          <Text style={styles.title}>Chưa thanh toán</Text>
        </TouchableOpacity>
      </View> */}
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={{
          backgroundColor: '#3697A6',
          height: 5,
          borderRadius: 5,
        }}
        containerStyle={styles.tab}
        scrollable={true}
        variant="primary">
        <Tab.Item
          title="Chờ xác nhận"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'timer', type: 'ionicon', color: 'gray'}}
        />
        <Tab.Item
          title="Đã xác nhận"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'bag-check-outline', type: 'ionicon', color: 'gray'}}
        />
        <Tab.Item
          title="Đang giao"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'car-outline', type: 'ionicon', color: 'gray'}}
        />
        <Tab.Item
          title="Đã giao"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{
            name: 'checkmark-done-outline',
            type: 'ionicon',
            color: 'gray',
          }}
        />
        <Tab.Item
          title="Đã hủy"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{
            name: 'close-circle-outline',
            type: 'ionicon',
            color: 'gray',
          }}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item
          style={{
            backgroundColor: '#ccc',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ContentTab orderItem={Pending} navigation={navigation} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: '#ccc', width: '100%'}}>
          <ContentTab orderItem={Processing} navigation={navigation} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: '#ccc', width: '100%'}}>
          <ContentTab orderItem={Delivering} navigation={navigation} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: '#ccc', width: '100%'}}>
          <ContentTab orderItem={Delivered} navigation={navigation} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: '#ccc', width: '100%'}}>
          <ContentTab orderItem={Canceled} />
        </TabView.Item>
      </TabView>
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
interface id {
  id: string;
}
const ContentTab = ({orderItem, navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [IDBook, setIDBook] = useState<string>();
  const [token, setToken] = useState<tokenProp | null>(null);
  const {fetchReview} = useReview({token, rating, review});
  const [spining, setSpining] = useState(false);
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
  const handleBookPress = useCallback(
    (_id: string) => {
      console.log('id navigation: ', _id);
      navigation.navigate('BookDetail', {bookId: _id});
    },
    [navigation],
  );
  const formatDate = (rawDate: Date) => {
    const date = new Date(rawDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
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
  }, []);
  const handleReview = async () => {
    console.log('IDBook', IDBook);
    try {
      setSpining(true);
      await fetchReview(IDBook || '');
      setVisible(false);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setSpining(false);
    }
  };
  return (
    <ScrollView nestedScrollEnabled={true}>
      {Array.isArray(orderItem) &&
        orderItem?.map((item: any) => (
          <View style={styles.viewcontent}>
            <View style={styles.view}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={styles.price}>Ngày :</Text>
                <Text style={styles.price}>{formatDate(item.orderDate)}</Text>
              </View>
              <View style={styles.quantityControl} pointerEvents="none">
                <Text style={[styles.price, {fontWeight: 'bold'}]}>
                  Tổng tiền: {formatCurrency(item.totalAmount)}
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal={true}
              key={item._id}
              contentContainerStyle={styles.scrollViewContent}>
              {Array.isArray(item.orderItems) &&
                item.orderItems.map((order: any) => (
                  <View key={order._id}>
                    <TouchableOpacity
                      key={order.book._id}
                      onPress={() => {
                        handleBookPress(order.book._id);
                      }}>
                      <View style={styles.carousell}>
                        <View style={styles.bbookDetail}>
                          <Image
                            style={styles.imagebook}
                            source={
                              order.book.image !== ''
                                ? {uri: order.book.image}
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
                              {order.book.title}
                            </Text>
                            <Text
                              style={styles.price}
                              numberOfLines={1}
                              ellipsizeMode="tail">
                              {formatCurrency(order.book.price)}
                            </Text>
                            <Divider style={styles.divider} />
                            <View style={styles.categoryContainer}>
                              {order.book &&
                                order.book.categories.length > 0 &&
                                order.book.categories.map(
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
                            <Text
                              style={[styles.price, {width: 200}]}
                              numberOfLines={2}
                              ellipsizeMode="tail">
                              {order.book &&
                                order.book.authors
                                  .map(
                                    (author: authorProp) => author.authorName,
                                  )
                                  .join(', ')}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.editQuantity}>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={styles.price}>Số lượng :</Text>
                        <Text style={styles.price}>{order.quantity}</Text>
                      </View>
                      <View style={styles.quantityControl} pointerEvents="none">
                        <Text style={[styles.price, {fontWeight: 'bold'}]}>
                          Tổng tiền:{' '}
                          {formatCurrency(order.quantity * order.book.price)}
                        </Text>
                      </View>
                    </View>
                    {item.paymentStatus === 'PAID' &&
                      item.status === 'DELIVERED' && (
                        <View style={styles.editQuantity}>
                          <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Text style={styles.price}> </Text>
                          </View>
                          <TouchableOpacity
                            disabled={item.paymentStatus !== 'PAID'}
                            style={[styles.buttonLogout]}
                            onPress={() => {
                              setVisible(true);
                              setIDBook(order?.book?._id || '');
                              setRating(0);
                              setReview('');
                            }}>
                            <Text
                              style={[
                                styles.price,
                                {fontWeight: 'bold', fontSize: 18},
                              ]}>
                              Đánh giá
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                  </View>
                ))}
            </ScrollView>
          </View>
        ))}
      {orderItem.length === 0 && (
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
      <Modal
        style={styles.modal}
        isVisible={visible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.2}
        backdropColor="black"
        animationInTiming={700}
        animationOutTiming={700}
        onBackdropPress={() => {
          setVisible(false);
          setRating(0);
          setReview('');
        }}>
        <View style={styles.modalView}>
          <View style={styles.contentModal}>
            <Text style={styles.titleModal}>Đánh giá</Text>
            <Divider />
            <TextInput
              style={styles.inputContainer}
              placeholder="Đánh giá sản phẩm ở đây"
              onChangeText={(text: React.SetStateAction<string>) =>
                setReview(text)
              }
              value={review}
              multiline={true}
            />
            <Rating
              type="star"
              startingValue={rating}
              fractions={1}
              imageSize={30}
              showRating={true}
              showReadOnlyText={false}
              style={{alignItems: 'center', margin: 5}}
              onFinishRating={(value: number) => setRating(value)}
            />
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.buttonLogout, {backgroundColor: '#ccc'}]}
                onPress={() => {
                  setVisible(false);
                }}>
                <Text style={styles.title}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonLogout}
                onPress={() => {
                  console.log('rating & review:', rating, review);
                  handleReview();
                }}>
                <Text style={styles.title}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
      <Toast />
    </ScrollView>
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
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 150,
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
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  tab: {
    backgroundColor: 'white',
    color: 'black',
  },
  viewcontent: {
    backgroundColor: 'white',
    borderRadius: 24,
    margin: 3,
  },
  scrollViewContent: {
    flexGrow: 1,
    margin: 5,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 2,
    alignSelf: 'center',
    width: 365,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  view: {
    marginTop: 2,
    marginBottom: 2,
    alignSelf: 'center',
    width: 365,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
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
  bbookDetail: {
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
    height: '60%',
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

export default HistoryPage;
