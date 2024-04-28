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
import Header from '../components/Header';
import {useBookData} from '../utils/api';
import {useIsFocused} from '@react-navigation/native';
import {trim} from 'validator';
const ListBook = ({navigation, route}: any) => {
  const isFocused = useIsFocused();
  const {filters} = route.params || {};
  const {searchKey} = route.params || '';
  const filtersExist = filters && Object.keys(filters).length > 0;
  const filtersToUse = filtersExist
    ? {filters}
    : {
        filters: {
          categories: [],
          authors: [],
          minPrice: 0,
          maxPrice: 2000000,
          sortBy: null,
        },
      };

  console.log('filter:', filters);
  console.log('filter type:', typeof filters);
  const flatListRef = useRef(null);
  const [spining, setSpining] = useState(false);
  const [visibleBooks, setVisibleBooks] = useState(10);
  const {books, fetchBooks}: {books: any; fetchBooks: () => void} = useBookData(
    filtersToUse,
    {searchKey},
  );
  useEffect(() => {
    if (isFocused) {
      if (flatListRef.current) {
        (flatListRef.current as any).scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
    }
  }, [isFocused]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpining(true);
        await fetchBooks();
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setSpining(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchKey]);
  const loadMoreBooks = () => {
    try {
      setSpining(true);
      setVisibleBooks(prevVisibleBooks => prevVisibleBooks + 10);
    } catch {
      console.log('error setVisibleBooks');
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
  return (
    <View style={styles.container}>
      <Header navigation={navigation} searchKey={searchKey} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleContainer} numberOfLines={1}>
          Kết quả {searchKey?.trim() !== undefined ? `: ${searchKey}` : ''}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FilterPage');
          }}>
          <Image
            source={require('../assets/icons/filter.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {books && Object.keys(books).length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={books ? books.slice(0, visibleBooks) : []}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
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
                      source={require('../assets/icons/wish.png')}
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
            );
          }}
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <Text style={styles.NoneContent}>Không tìm thấy</Text>
      )}

      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 5,
    width: 30,
    height: 30,
    padding: 10,
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
});

export default ListBook;
