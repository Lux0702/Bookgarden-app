/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {Avatar, Divider} from 'react-native-paper';
// import {ActivityIndicator, MD2Colors, HelperText} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {Rating} from 'react-native-ratings';
interface ReviewProp {
  id: string;
  user: {
    id: string;
    fullname: string;
    avatar: string;
  };
  review: string;
  rating: number;
}

const ReviewMore = ({navigation, route}: any) => {
  const {book} = route.params || null;
  //   function convertDateFormat(dateString: string) {
  //     const date = new Date(dateString);
  //     const day = date.getDate().toString().padStart(2, '0');
  //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //     const year = date.getFullYear();

  //     return `${day}/${month}/${year}`;
  //   }
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => navigation.navigate('BookDetail')}>
        <Image source={require('../assets/icons/back-icon.png')} />
        <Text style={styles.titleProfile}> Chi tiết đánh giá</Text>
        <Image
          source={require('../assets/icons/heart.png')}
          style={{opacity: 0}}
        />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Rating
          type="star"
          startingValue={
            book && book.reviews && book.reviews.length > 0
              ? book.reviews.reduce(
                  (total: any, review: {rating: any}) => total + review.rating,
                  0,
                ) / book.reviews.length
              : 0
          }
          fractions={1}
          imageSize={50}
          showRating={true}
          readonly
          showReadOnlyText={false}
          style={{alignItems: 'flex-start', margin: 5}}
        />
        {book && book.reviews && book.reviews.length > 0 ? (
          <View style={styles.reivewContainer}>
            {book.reviews.map((review: ReviewProp) => (
              <View key={review.id} style={styles.reviewUser}>
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
                  <Text style={styles.textDetail}>{review.review}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>Không có đánh giá</Text>
        )}
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
  reivewContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    width: '100%',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Roboto_400Regular',
    padding: 5,
    fontWeight: '400',
    textAlign: 'justify',
    flexWrap: 'wrap',
    display: 'flex',
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
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
    padding: 5,
  },
});
export default ReviewMore;
