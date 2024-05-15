import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useCategoryData} from '../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';
interface CategoryProp {
  id: string;
  categoryName: string;
}
const Categories = ({navigation}: any) => {
  const {
    categories,
    fetchCategory,
  }: {categories: any; fetchCategory: () => void} = useCategoryData();
  const [spining, setSpining] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      try {
        setSpining(true);
        fetchCategory();
      } catch {
        console.log('fetch error');
      } finally {
        setSpining(false);
      }
    };
    fetchData();
  }, []);
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thể loại</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('Category');
          }}>
          <Text style={styles.more}> Xem thêm</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        {categories.slice(1, 9).map((item: CategoryProp, index: number) => (
          <Pressable
            key={index}
            onPress={() => {
              navigation.navigate('ListBook', {
                filters: {
                  categories: [item.categoryName],
                  authors: [],
                  minPrice: 0,
                  maxPrice: 2000000,
                  sortBy: null,
                },
              });
            }}>
            <View key={item.id}>
              <View
                style={
                  index === 0
                    ? styles.itemContainer1
                    : index === 1
                    ? styles.itemContainer2
                    : index === 2
                    ? styles.itemContainer3
                    : index === 3
                    ? styles.itemContainer4
                    : index === 4
                    ? styles.itemContainer5
                    : index === 5
                    ? styles.itemContainer6
                    : index === 6
                    ? styles.itemContainer7
                    : styles.itemContainer8
                }>
                <View style={styles.overlay} />
                <Text
                  style={styles.itemText}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item.categoryName}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
      <Spinner
        visible={spining}
        textContent={'Đang xử lí...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
    position: 'relative',
  },
  spinnerTextStyle: {
    color: 'black',
  },
  more: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'normal',
  },
  titleContainer: {
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer1: {
    padding: 5,
    backgroundColor: '#DC9497',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    zIndex: 1,
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    top: -20,
    left: -20,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 500, 0.2)', // Màu trắng với độ mờ 50%
    zIndex: 2,
    borderRadius: 25,
    width: 60,
    height: 60,
  },
  itemContainer2: {
    padding: 5,
    backgroundColor: '#93C19E',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer3: {
    padding: 5,
    backgroundColor: '#F5AD7E',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer4: {
    padding: 5,
    backgroundColor: '#ACA1CD',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer5: {
    padding: 5,
    backgroundColor: '#4D9B91',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer6: {
    padding: 5,
    backgroundColor: '#352261',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer7: {
    padding: 5,
    backgroundColor: '#DEB6B5',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer8: {
    padding: 5,
    backgroundColor: '#89CCDB',
    borderRadius: 12,
    width: 62,
    height: 62,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    margin: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    position: 'absolute',
    color: '#4B5563',
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'center',
    width: 62,
    overflow: 'hidden',
    zIndex: 3,
    fontWeight: 'bold',
    padding: 5,
  },
});

export default Categories;
