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
import {useNavigation} from '@react-navigation/native';
import {API_BASE} from '../utils/utils';
import {Dialog, Avatar, Divider} from 'react-native-paper';
// import {ActivityIndicator, MD2Colors, HelperText} from 'react-native-paper';
import Toast from 'react-native-toast-message';
// import RNPickerSelect from 'react-native-picker-select';
// import validator from 'validator';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {
//   ImagePickerResponse,
//   launchCamera,
//   launchImageLibrary,
// } from 'react-native-image-picker';
import {Rating} from 'react-native-ratings';
import BookCard from '../components/bookComponnent';
const DetailMore = ({navigation, route}: any) => {
  const {book} = route.params || null;
  const [visible, setVisible] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const bookData: {
    rating: number;
    title: string;
    imageUrl: string;
    price: string;
  }[] = [
    {
      rating: 1,
      title: 'Book 1',
      imageUrl:
        'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',
      price: '80.000',
    },
    {
      rating: 2,
      title: 'Book 2',
      imageUrl:
        'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',
      price: '80.000',
    },
    {
      rating: 3,
      title: 'Book 3',
      imageUrl:
        'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',

      price: '80.000',
    },
    {
      rating: 2,
      title: 'Book 2',
      imageUrl:
        'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',

      price: '80.000',
    },
    {
      rating: 3,
      title: 'Book 3',
      imageUrl:
        'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',

      price: '80.000',
    },
    // Add more books as needed
  ];
  function convertDateFormat(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('BookDetail')}>
        <Image source={require('../assets/icons/back-icon.png')} />
        <Text style={styles.titleProfile}> Chi tiết sách</Text>
        <Image source={require('../assets/icons/heart.png')} />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.titleBook}>{book !== null ? book.title : ''}</Text>
        <Text style={styles.textDetail}>{book.description}</Text>
        <Divider style={styles.divider} />
        <View style={styles.categoryContainer}>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile}> Ngôn ngữ</Text>
            <Text style={styles.title}> {book.language}</Text>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile}> Nhà xuất bản</Text>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {book.publisher}
            </Text>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile}> Thể loại</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {book &&
                  book.categories
                    .map(
                      (category: {categoryName: any}) => category.categoryName,
                    )
                    .join(', ')}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile} numberOfLines={1}>
              Ngày xuất bản
            </Text>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {convertDateFormat(book.publishedDate)}
            </Text>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile} numberOfLines={1}>
              Tác giả
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {book &&
                  book.authors
                    .map((author: {authorName: any}) => author.authorName)
                    .join(', ')}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile}> ISBN</Text>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {' '}
              {book.isbn}
            </Text>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile}> Số trang</Text>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {' '}
              {book.pageNumbers}
            </Text>
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.titleProfile}> Đã bán</Text>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {' '}
              {book.soldQuantity}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Toast />
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    margin: 2,
    justifyContent: 'space-between',
  },
  textInfo: {
    fontSize: 24,
    height: 'auto',
    width: '45%',
    color: '#262626',
    borderStyle: 'solid',
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '300',
    marginRight: 15,
    padding: 5,
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
    width: '90%',
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
    width: '90%',
    fontSize: 24,
    color: '#262626',
    fontWeight: '700',
    textAlign: 'justify',
  },
  title: {
    fontSize: 20,
    width: '100%',
    color: '#1C2A3A',
    fontWeight: '300',
    justifyContent: 'center',
    fontStyle: 'italic',
  },
  more: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'normal',
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
    maxWidth: '80%',
    fontWeight: '700',
    marginTop: 5,
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
  divider: {
    width: '90%',
    margin: 10,
    height: 1,
  },
});
export default DetailMore;
