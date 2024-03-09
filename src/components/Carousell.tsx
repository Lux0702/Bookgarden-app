import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');

interface CarouselItem {
  // title: string;
  image: any;
}

const data: CarouselItem[] = [
  {image: require('../assets/images/carousell1.png')},
  {image: require('../assets/images/carousell2.png')},

  // Add more items as needed
];

const CarouselComponent: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const renderItem = ({item}: {item: CarouselItem}) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.9}
        onSnapToItem={index => setActiveIndex(index)}
        layout={'default'}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    width: screenWidth * 0.9,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  paginationContainer: {
    paddingVertical: 5,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: '#888',
    marginTop: 2,
  },
});

export default CarouselComponent;
