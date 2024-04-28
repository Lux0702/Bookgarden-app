import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Rating} from 'react-native-ratings';
import {Divider} from 'react-native-paper';

interface BookCardProps {
  _id: string;
  title: string;
  image: any;
  rating: number;
  price: number;
}
class BookCard extends PureComponent<BookCardProps> {
  render() {
    const {_id, title, image, rating, price} = this.props;
    return (
      <View style={styles.container} key={_id}>
        <Image
          style={styles.imagebook}
          source={
            image && image !== ''
              ? {uri: image}
              : require('../assets/images/Bookcover.png')
          }
        />
        <Image
          style={styles.icon}
          source={require('../assets/icons/wish.png')}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Rating
            type="star"
            startingValue={rating}
            fractions={1}
            imageSize={10}
            style={styles.rating}
          />
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.price} numberOfLines={1} ellipsizeMode="tail">
          {price}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 230,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 8,
  },
  imagebook: {
    width: '100%',
    marginTop: 0,
    height: 169,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'black',
    flexDirection: 'column',
  },
  title: {
    margin: 2,
    width: '90%',
    fontWeight: 'bold',
    color: '#4B5563',
    alignItems: 'center', // Canh giữa theo chiều ngang
    justifyContent: 'center', // Canh giữa theo chiều dọc
    textAlign: 'center',
  },
  rating: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 2,
    height: 5,
  },
  divider: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 2,
  },
  price: {
    fontWeight: 'normal',
    color: '#6B7280',
    alignItems: 'center', // Canh giữa theo chiều ngang
    justifyContent: 'center', // Canh giữa theo chiều dọc
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 27,
    height: 27,
    resizeMode: 'contain',
    zIndex: 1,
  },
});
export default BookCard;
