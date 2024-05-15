import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// import {API_BASE} from '../utils/utils';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useWishlistData, useDeleteWish} from '../utils/api';
import {useIsFocused} from '@react-navigation/native';
import {isLoggedIn} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {useNavigationState} from '@react-navigation/native';
import {useTokenExpirationCheck} from '../service/useTokenExpirationCheck';
import {Swipeable} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
interface tokenProp {
  accessToken: string;
  refreshToken: string;
}
interface BookDetailProp {
  bookId: string;
}
const Wishlist = ({navigation}: any) => {
  let {IsChange, checkTokenExpiration} = useTokenExpirationCheck();
  const navigationState = useNavigationState(state => state);
  const isWishlistTabFocused =
    navigationState.index === 2 &&
    navigationState.routes[navigationState.index].name === 'Yêu thích';
  console.log('focus:', isWishlistTabFocused);
  const [token, setToken] = useState<tokenProp | null>(null);
  const flatListRef = useRef(null);
  const [spining, setSpining] = useState(false);
  const [visiblewishlist, setVisiblewishlist] = useState(10);
  const [visible, setVisible] = useState(false);
  const [Isdelete, setDelete] = useState(false);
  const login = isLoggedIn();
  console.log('Is logged in:', login);
  const {wishlist, fetchWishlist}: {wishlist: any; fetchWishlist: () => void} =
    useWishlistData({token});
  const {fetchDeleteWish} = useDeleteWish({
    token,
  });
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
    if (isWishlistTabFocused && login) {
      checkTokenExpiration();
    }
  }, [isWishlistTabFocused, login]);

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (login) {
        try {
          setSpining(true);
          await fetchWishlist();
        } catch (error) {
          console.log('Error fetch:', error);
        } finally {
          setSpining(false);
          setDelete(false);
        }
      } else if (!login) {
        setVisible(true);
      }
    };
    fetchDataIfNeeded();
  }, [isWishlistTabFocused, login, token, Isdelete]);
  useEffect(() => {
    if (isWishlistTabFocused) {
      if (flatListRef.current) {
        (flatListRef.current as any).scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
    }
  }, [isWishlistTabFocused]);
  const loadMorewishlist = () => {
    try {
      setSpining(true);
      setVisiblewishlist(prevVisiblewishlist => prevVisiblewishlist + 10);
    } catch {
      console.log('error setVisiblewishlist');
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
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
  };
  interface categoryProp {
    id: string;
    categoryName: string;
  }
  interface authorProp {
    id: string;
    authorName: string;
  }
  const rightSwiple = (bookId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          handleDeleteWish(bookId);
        }}>
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    );
  };
  const handleDeleteWish = async (bookId: string) => {
    console.log('book id xoa: ', bookId);
    if (login) {
      try {
        setSpining(true);
        await fetchDeleteWish(bookId);
        setDelete(true);
      } catch (error) {
        console.log('lỗi kết nối', error);
      } finally {
        setSpining(false);
      }
    } else {
      Toast.show({
        type: 'info',
        text1: 'thêm yêu thích ',
        text2: 'Vui lòng đăng nhập để thêm',
      });
    }
  };
  return (
    <View style={styles.container}>
      {login && Object.keys(wishlist).length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={wishlist ? wishlist.slice(0, visiblewishlist) : []}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => {
            return (
              <Swipeable renderRightActions={() => rightSwiple(item._id)}>
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
                          item.image !== ''
                            ? {uri: item.image}
                            : require('../assets/images/Bookcover.png')
                        }
                      />
                      <Image
                        style={styles.iconWish}
                        source={require('../assets/icons/wished.png')}
                      />
                      <View style={styles.detail}>
                        <Text
                          style={styles.titleBook}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item.title}
                        </Text>
                        <Text
                          style={styles.price}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {formatCurrency(item.price)}
                        </Text>
                        <Divider style={styles.divider} />
                        <View style={styles.categoryContainer}>
                          {item &&
                            item.categories.length > 0 &&
                            item.categories.map((category: categoryProp) => (
                              <Text
                                key={category.id}
                                style={styles.textCategory}
                                numberOfLines={1}>
                                {category.categoryName}
                              </Text>
                            ))}
                        </View>
                        {/* <Divider style={styles.divider} /> */}
                        <Text
                          style={[styles.price, {width: 200}]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item &&
                            item.authors
                              .map((author: authorProp) => author.authorName)
                              .join(', ')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            );
          }}
          onEndReached={loadMorewishlist}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <Text style={styles.NoneContent}>Chưa có sách yêu thích</Text>
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
    marginBottom: 70,
  },
  deleteButton: {
    backgroundColor: '#FF3333',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 200,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default Wishlist;
