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
import {Swipeable} from 'react-native-gesture-handler';
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
import {List} from 'react-native-paper';

const Notification = ({navigation}: any) => {
  const rightSwiple = () => {
    return (
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={tw`flex-1  items-center bg-white`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}>
        <Swipeable renderRightActions={rightSwiple}>
          <List.Accordion
            style={styles.contentView}
            title="Đơn hàng"
            titleStyle={{fontWeight: '700'}}
            description="Đặt hàng thành công">
            <List.Item title="First item" description="Item description" />
          </List.Accordion>
        </Swipeable>
        <Divider />
        <Swipeable renderRightActions={rightSwiple}>
          <List.Accordion
            style={styles.contentView}
            title="Đánh giá sản phẩm"
            titleStyle={{fontWeight: '700'}}
            description="Cảm ơn bạn đã đánh giá">
            <List.Item title="First item" description="Item description" />
          </List.Accordion>
        </Swipeable>
        <Divider />
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
  deleteButton: {
    backgroundColor: '#FF3333',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 90,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    width: '100%',
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
export default Notification;
