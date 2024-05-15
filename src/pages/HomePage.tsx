import React, {memo, useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import Header from '../components/Header';

import {logout} from '../service/AuthService';
import CarouselComponent from '../components/Carousell';
import tw from 'tailwind-react-native-classnames';
// import tai from 'rn-tw';
import Categories from '../components/CategoryComponent';
import BookCard from '../components/bookComponnent';
import {BestSeller, AppointBook} from '../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';
// interface BookCardProps {
//   _id: string;
//   title: string;
//   image: any;
//   rating: number;
//   price: number;
// }
const HomePage = ({navigation}: any) => {
  const [spining, setSpining] = useState(false);
  const {bestbooks, fetchBooks}: {bestbooks: any; fetchBooks: () => void} =
    BestSeller();
  const {
    appointBook,
    fetchAppointBooks,
  }: {appointBook: any; fetchAppointBooks: () => void} = AppointBook();
  const handleLogout = () => {
    logout()
      .then(() => navigation.navigate('Login'))
      .catch(error => console.error(error));
    //navigation.navigate('Login')
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpining(true);
        await fetchBooks();
        await fetchAppointBooks();
      } catch {
        console.log('fetch error');
      } finally {
        setSpining(false);
      }
    };
    fetchData();
  }, []);
  // const bookData: {
  //   rating: number;
  //   title: string;
  //   image: string;
  //   price: number;
  // }[] = [
  //   {
  //     rating: 1,
  //     title: 'Book 1',
  //     image:
  //       'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',
  //     price: 80000,
  //   },
  //   {
  //     rating: 2,
  //     title: 'Book 2',
  //     image:
  //       'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',
  //     price: 80000,
  //   },
  //   {
  //     rating: 3,
  //     title: 'Book 3',
  //     image:
  //       'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',

  //     price: 80000,
  //   },
  //   {
  //     rating: 2,
  //     title: 'Book 2',
  //     image:
  //       'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',

  //     price: 80000,
  //   },
  //   {
  //     rating: 3,
  //     title: 'Book 3',
  //     image:
  //       'https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg',

  //     price: 80000,
  //   },
  //   // Add more books as needed
  // ];
  console.log(bestbooks[0]);
  const handleBookPress = useCallback(
    (_id: string) => {
      console.log('id navigation: ', _id);
      navigation.navigate('BookDetail', {bookId: _id});
    },
    [navigation],
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={tw`flex-1`}>
        <Header navigation={navigation} />
        <ScrollView>
          <CarouselComponent />
          <Categories navigation={navigation} />
          <View style={styles.bestseller}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Top sản phẩm</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ListBook', {
                    filters: {
                      categories: [],
                      authors: [],
                      minPrice: 0,
                      maxPrice: 2000000,
                      sortBy: 0,
                    },
                  });
                }}>
                <Text style={styles.more}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            {/* <BookCard /> */}
            <FlatList
              horizontal={true}
              data={bestbooks.slice(0, 10)}
              keyExtractor={item => item._id.toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.carousell} key={item._id}>
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
          <View style={styles.Firstseller}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Top đề cử</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ListBook', {
                    filters: {
                      categories: [],
                      authors: [],
                      minPrice: 0,
                      maxPrice: 2000000,
                      sortBy: 1,
                    },
                  });
                }}>
                <Text style={styles.more}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            {/* <BookCard /> */}
            <FlatList
              horizontal={true}
              data={appointBook}
              keyExtractor={item => item._id.toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.carousell} key={item._id}>
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
      </View>
      <Spinner
        visible={spining}
        textContent={'Đang xử lí...'}
        textStyle={styles.spinnerTextStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  carousell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Căn lề trái
    marginHorizontal: 10,
    marginVertical: 10,
    marginLeft: 20,
  },
  text: {
    top: 0,
    marginTop: 0,
  },
  bestseller: {
    ...tw`bg-white bg-opacity-20`,
    borderRadius: 8,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Firstseller: {
    ...tw`bg-white bg-opacity-20`,
    borderRadius: 8,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 80,
  },
  titleContainer: {
    marginTop: 5,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  more: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'normal',
  },
});

export default memo(HomePage);
