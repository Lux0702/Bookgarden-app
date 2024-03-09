import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
// import { Text } from 'react-native-svg';

const {width: screenWidth} = Dimensions.get('window');

interface CarouselItem {
  title: string;
}

const data: CarouselItem[] = [
  {title: 'item1'},

  // Add more items as needed
];

const Categories: React.FC = () => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thể loại</Text>
        <Text style={styles.title}> Xem thêm</Text>
      </View>
      <View style={styles.container}>
        <View>
          <View style={styles.itemContainer1}>
            <View style={styles.overlay} />
            <Text style={styles.itemText}> Kinh dị</Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer2}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Lãng mạn
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer3}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Tiểu Thuyết
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer4}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Tiểu Thuyết
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer5}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Tiểu Thuyết
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer6}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Tiểu Thuyết
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer7}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Tiểu Thuyết
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.itemContainer8}>
            <View style={styles.overlay} />
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {' '}
              Tiểu Thuyết
            </Text>
          </View>
        </View>
      </View>
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
  },
});

export default Categories;
