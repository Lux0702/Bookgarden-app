/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {API_BASE} from '../utils/utils';
import {Dialog, Avatar, Divider} from 'react-native-paper';
import {ActivityIndicator, MD2Colors, HelperText} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import validator from 'validator';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Rating} from 'react-native-ratings';
import BookCard from '../components/bookComponnent';
import {useBookDetail, useBookRelate} from '../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';
import Categories from '../components/CategoryComponent';
import {useIsFocused} from '@react-navigation/native';
const BookDetail = ({navigation, route}: any) => {
  const isFocused = useIsFocused();
  const {bookId} = route.params || '';
  const [spining, setSpining] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const {detailBook, fetchDetail} = useBookDetail({bookId});
  const {relateBook, fetchRelate}: {relateBook: any; fetchRelate: () => void} =
    useBookRelate({bookId});
  const scrollViewRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpining(true);
        await fetchDetail();
        await fetchRelate();
        if (scrollViewRef.current) {
          (scrollViewRef.current as any).scrollTo({y: 0, animated: true});
        }
      } catch {
        console.log('Error get data');
      } finally {
        setSpining(false);
      }
    };
    fetchData();
  }, [bookId]);
  const hideDialog = () => setVisible(false);
  console.log('Rating:', detailBook && detailBook.reviews);
  console.log('Rating:', detailBook && typeof detailBook.reviews);
  const handleBookPress = useCallback(
    (_id: string) => {
      try {
        setSpining(true);
        navigation.navigate('BookDetail', {bookId: _id});
      } catch (error) {
        console.log('Error navigating to BookDetail:', error);
      } finally {
        setSpining(false);
      }
    },
    [navigation],
  );
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.goBack()}>
        <Image source={require('../assets/icons/back-icon.png')} />
        <Text style={styles.titleProfile}> Chi tiết sách</Text>
        <Image source={require('../assets/icons/heart.png')} />
      </TouchableOpacity>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.BookDetail}>
          <Image
            style={styles.imagebook}
            source={
              detailBook && detailBook.image !== ''
                ? {uri: detailBook.image}
                : require('../assets/images/Bookcover.png')
            }
          />
          <View style={styles.detail}>
            <Text
              style={styles.titleBook}
              numberOfLines={2}
              ellipsizeMode="tail">
              {detailBook !== null ? detailBook.title : ''}{' '}
            </Text>
            <Rating
              type="star"
              startingValue={
                detailBook &&
                detailBook.reviews &&
                detailBook.reviews.length > 0
                  ? detailBook.reviews.reduce(
                      (total, review) => total + review.rating,
                      0,
                    ) / detailBook.reviews.length
                  : 0
              }
              fractions={1}
              imageSize={15}
              style={{alignItems: 'flex-start', margin: 5}}
            />
            <Text style={styles.price} numberOfLines={1} ellipsizeMode="tail">
              80.000 Đ
            </Text>
            <Divider />
            <View style={styles.categoryContainer}>
              {detailBook &&
                detailBook.categories.length > 0 &&
                detailBook.categories.map(category => (
                  <Text
                    key={category.id}
                    style={styles.textCategory}
                    numberOfLines={1}>
                    {category.categoryName}
                  </Text>
                ))}
            </View>
            <Divider />
            <Text
              style={[styles.price, {width: 200}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {detailBook &&
                detailBook.authors.map(author => author.authorName).join(', ')}
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={[styles.buttonPurchase, {backgroundColor: '#ccc'}]}
            onPress={() => {
              setVisible(false);
            }}>
            <Text style={styles.title}>Thêm vào giỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonPurchase}
            onPress={() => {
              //   navigation.navigate('Home');
            }}>
            <Text style={[styles.title, {color: '#fff'}]}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ratingView}>
          <View style={styles.contentView}>
            <Image source={require('../assets/icons/customer.png')} />
            <Text style={styles.textReview}>
              {detailBook && detailBook.soldQuantity}
            </Text>
            <Text style={styles.textReview}>Đã bán</Text>
          </View>
          <View style={styles.contentView}>
            <Image source={require('../assets/icons/star.png')} />
            <Text style={styles.textReview}>
              {detailBook && detailBook.reviews && detailBook.reviews.length > 0
                ? detailBook.reviews.reduce(
                    (total, review) => total + review.rating,
                    0,
                  ) / detailBook.reviews.length
                : 0}
            </Text>
            <Text style={styles.textReview}>Chất lượng</Text>
          </View>
          <View style={styles.contentView}>
            <Image source={require('../assets/icons/reviews.png')} />
            <Text style={styles.textReview}>
              {detailBook && detailBook.reviews.length}
            </Text>
            <Text style={styles.textReview}>Đánh giá</Text>
          </View>
        </View>
        <View style={styles.titlecontainer}>
          <Text style={styles.titleProfile}>Chi tiết sách</Text>
          <Pressable
            onPress={() => {
              navigation.navigate('DetailMore', {
                book: detailBook,
              });
            }}>
            <Text style={styles.more}>Xem thêm</Text>
          </Pressable>
        </View>
        <Text style={styles.textDetail} numberOfLines={4} ellipsizeMode="tail">
          {detailBook && detailBook.description}
        </Text>
        <View style={[styles.titlecontainer, {marginTop: 0}]}>
          <Text style={styles.titleProfile}>Đánh giá</Text>
          <Pressable>
            <Text style={styles.more}>Xem thêm</Text>
          </Pressable>
        </View>
        {detailBook && detailBook.reviews && detailBook.reviews.length > 0 ? (
          <View style={styles.reivewContainer}>
            {detailBook.reviews.map(review => (
              <View
                key={review.id}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar.Image size={55} source={{uri: review.user.avatar}} />
                <View style={{flexDirection: 'column', marginLeft: 10}}>
                  <Text>{review.user.fullname}</Text>
                  <Rating
                    type="star"
                    startingValue={review.rating}
                    fractions={1}
                    imageSize={10}
                    style={{alignItems: 'flex-start', margin: 5}}
                  />
                  <Text
                    style={styles.textDetail}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {review.review}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>Không có đánh giá</Text>
        )}

        <View style={[styles.titlecontainer, {marginTop: 0}]}>
          <Text style={styles.titleProfile}>Sách liên quan</Text>
          <Pressable
            onPress={() => {
              navigation.navigate('ListBook');
            }}>
            <Text style={styles.more}>Xem thêm</Text>
          </Pressable>
        </View>
        <View style={styles.relateBook}>
          {/* <BookCard /> */}
          <FlatList
            horizontal={true}
            data={relateBook}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => {
              return (
                <View style={styles.carousell}>
                  <TouchableOpacity
                    onPress={() => {
                      handleBookPress(item._id);
                    }}>
                    <BookCard
                      _id={item._id}
                      title={item.title}
                      image={item.image}
                      price={item.price}
                      rating={Math.random() * 5}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      <Toast />
      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.9)"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: 'black',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    margin: 5,
    justifyContent: 'space-between',
    paddingTop: 0,
    overflow: 'hidden',
    height: 77,
  },
  carousell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 10,
    marginLeft: 20,
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
    fontWeight: '300',
    borderWidth: 1,
    margin: 5,
    padding: 5,
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
  imagebook: {
    width: 130,
    height: 200,
    marginTop: 0,
    borderRadius: 8,
  },
  BookDetail: {
    flexDirection: 'row',
    width: 365,
    height: 235,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
    width: '90%',
  },
  imageProfile: {
    width: 170,
    height: 170,
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 10,
  },
  titlecontainer: {
    width: '90%',
    height: 60,
    lineHeight: 35,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleProfile: {
    fontSize: 24,
    color: '#262626',
    fontWeight: '700',
  },
  titleBook: {
    width: 200,
    fontSize: 21,
    color: '#262626',
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    width: '100%',
    color: '#1C2A3A',
    textAlign: 'center',
    fontWeight: '800',
    alignItems: 'center',
    justifyContent: 'center',
    fontStyle: 'italic',
  },
  more: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'normal',
  },
  ratingView: {
    width: '90%',
    height: 60,
    lineHeight: 35,
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 15,
    // paddingTop: 0,
  },
  reivewContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentView: {
    flexDirection: 'column',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    height: 150,
  },
  textDetail: {
    width: '90%',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Roboto_400Regular',
    padding: 5,
    fontWeight: '400',
    textAlign: 'justify',
  },
  textReview: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#1C2A3A',
    maxWidth: '100%',
    fontWeight: '700',
    marginTop: 5,
  },
  buttonPurchase: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
    borderRadius: 25,
  },
  buttonSubmit: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 15,
    borderRadius: 25,
  },
  image: {
    resizeMode: 'contain',
    width: 170,
    height: 170,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderRadius: 100,
    borderWidth: 1,
  },
  icon: {
    position: 'absolute',
    width: 30,
    height: 30,
    padding: 10,
    right: 0,
    bottom: 30,
    left: 147,
  },
  scrollview: {
    flexGrow: 1,
    width: '100%',
  },
  dialog: {
    backgroundColor: 'white',
  },
  spinner: {
    margin: 10,
  },
  relateBook: {
    ...tw`bg-white bg-opacity-20`,
    borderRadius: 8,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
export default BookDetail;
