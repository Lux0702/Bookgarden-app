import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import tw from 'tailwind-react-native-classnames';
import {useCategoryData, useAuthorsData} from '../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import {CheckBox} from '@rneui/themed';
import RangeSlider from 'rn-range-slider';
import {Thumb, Rail, RailSelected} from '../components/rangeSlider';
interface CategoryProp {
  id: string;
  categoryName: string;
}
interface AuthorsProp {
  id: string;
  authorName: string;
}
const FilterPage = ({navigation}: any) => {
  // const [animation] = useState(new Animated.Value(0));
  const [selectedIndex, setIndex] = React.useState();
  const {
    categories,
    fetchCategory,
  }: {categories: any; fetchCategory: () => void} = useCategoryData();
  const {authors, fetchAuthors}: {authors: any; fetchAuthors: () => void} =
    useAuthorsData();
  const [spining, setSpining] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  // const [visibleCategories, setVisibleCategories] = useState(5);
  // const loadMoreCategories = () => {
  //   // Tăng số lượng sách hiển thị lên 10 mỗi lần cuộn đến cuối
  //   setSpining(true);
  //   setVisibleCategories(prevVisibleCategories => prevVisibleCategories + 10);
  //   setSpining(false);
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpining(true);
        await fetchCategory();
        await fetchAuthors();
        setSpining(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSpining(false);
      }
    };

    fetchData();
  }, []);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);

  const handlePriceChange = (
    min: React.SetStateAction<number>,
    max: React.SetStateAction<number>,
  ) => {
    setMinPrice(min);
    setMaxPrice(max);
  };
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
  };
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView nestedScrollEnabled={true}>
        <Spinner
          visible={spining}
          textContent={'Đang tải...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.titlecontainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={require('../assets/icons/icon_delete.png')} />
          </TouchableOpacity>
          <Text style={styles.category}>Bộ lọc</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.contentContaier}>
            <Text style={styles.textSort}> Sắp xếp</Text>
            <CheckBox
              title={'Bán chạy nhất'}
              checked={selectedIndex === 0}
              onPress={() => setIndex(0)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
            <CheckBox
              checked={selectedIndex === 1}
              onPress={() => setIndex(1)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'Giá tăng dần'}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
            <CheckBox
              checked={selectedIndex === 2}
              onPress={() => setIndex(2)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'Giá giảm dần'}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
            <CheckBox
              checked={selectedIndex === 3}
              onPress={() => setIndex(3)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'A → Z'}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
            <CheckBox
              checked={selectedIndex === 4}
              onPress={() => setIndex(4)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'Z → A'}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
          </View>
          <View style={styles.contentContaier}>
            <Text style={styles.textSort}> Giá tiền</Text>
            <View style={styles.priceTextContainer}>
              <Text style={styles.priceText}>{formatCurrency(minPrice)}</Text>
              <Text>____</Text>
              <Text style={styles.priceText}> {formatCurrency(maxPrice)}</Text>
            </View>
            <RangeSlider
              style={styles.slider}
              min={0}
              max={2000000}
              step={10}
              floatingLabel
              renderThumb={name => <Thumb name={name} />}
              renderRail={() => <Rail />}
              renderRailSelected={() => <RailSelected />}
              renderLabel={value => (
                <Text style={styles.label}>{formatCurrency(value)}</Text>
              )} // Sửa lỗi ở đây
              onValueChanged={handlePriceChange}
            />
          </View>
          <View style={styles.contentContaier}>
            <Text style={styles.textSort}> Thể loại</Text>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              horizontal={true}>
              {categories.map((item: CategoryProp) => (
                <CheckBox
                  key={item.id}
                  title={item.categoryName}
                  checked={selectedCategories.includes(item.categoryName)}
                  onPress={() => {
                    // Nếu thể loại đã được chọn, loại bỏ khỏi danh sách đã chọn. Nếu chưa, thêm vào danh sách đã chọn.
                    if (selectedCategories.includes(item.categoryName)) {
                      setSelectedCategories(prev =>
                        prev.filter(cat => cat !== item.categoryName),
                      );
                    } else {
                      setSelectedCategories(prev => [
                        ...prev,
                        item.categoryName,
                      ]);
                    }
                  }}
                  iconType="material-community"
                  checkedIcon="checkbox-outline"
                  uncheckedIcon={'checkbox-blank-outline'}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.contentContaier}>
            <Text style={styles.textSort}> Tác giả</Text>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              horizontal={true}>
              {authors.map((item: AuthorsProp) => (
                <CheckBox
                  key={item.id}
                  title={item.authorName}
                  checked={selectedAuthors.includes(item.authorName)}
                  onPress={() => {
                    // Nếu thể loại đã được chọn, loại bỏ khỏi danh sách đã chọn. Nếu chưa, thêm vào danh sách đã chọn.
                    if (selectedCategories.includes(item.authorName)) {
                      setSelectedAuthors(prev =>
                        prev.filter(cat => cat !== item.authorName),
                      );
                    } else {
                      setSelectedAuthors(prev => [...prev, item.authorName]);
                    }
                  }}
                  iconType="material-community"
                  checkedIcon="checkbox-outline"
                  uncheckedIcon={'checkbox-blank-outline'}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.pressButton, {backgroundColor: '#ccc'}]}
              onPress={() => {
                navigation.navigate('ListBook', {
                  filters: {
                    categories: [],
                    authors: [],
                    minPrice,
                    maxPrice,
                    sortBy: selectedIndex,
                  },
                });
              }}>
              <Text style={styles.title}>Thiết lập lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pressButton}
              onPress={() => {
                navigation.navigate('ListBook', {
                  filters: {
                    categories: selectedCategories,
                    authors: selectedAuthors,
                    minPrice,
                    maxPrice,
                    sortBy: selectedIndex,
                  },
                });
              }}>
              <Text style={styles.title}>Lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
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
  pressButton: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#3697A6',
    padding: 12,
    borderRadius: 25,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
    width: '90%',
  },
  spinnerTextStyle: {
    color: '#1C2A3A',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 20,
  },
  textSort: {
    padding: 5,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2A37',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 5,
    borderTopWidth: 1,
    borderColor: '#EFECEC',
  },
  checkboxText: {
    fontSize: 16,
    color: '#1F2A37',
  },
  priceText: {
    backgroundColor: '#fff',
    padding: 5,
    borderWidth: 2,
    borderColor: '#EFECEC',
    width: 100,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  priceTextContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titlecontainer: {
    width: '90%',
    height: 70,
    lineHeight: 35,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContaier: {
    width: '90%',
    fontSize: 16,
    color: '#262626',
    borderRadius: 12,
    borderColor: 'black',
    backgroundColor: '#F6F6F6',
    borderStyle: 'solid',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 10,
  },
  category: {
    fontSize: 20,
    width: 100,
    color: '#262626',
    textAlign: 'center',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FilterPage;
