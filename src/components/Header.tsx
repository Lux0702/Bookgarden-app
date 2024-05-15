import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {logout} from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({navigation, searchKey}: any) => {
  const [search, setSearch] = useState('');
  const handleFocusSearch = () => {
    navigation.navigate('SearchPage');
  };
  useEffect(() => {
    if (searchKey) {
      setSearch(searchKey);
    }
  }, [searchKey]);
  const handleDeleteItem = useCallback(async () => {
    try {
      setSearch('');
      await navigation.navigate('ListBook', {
        searchKey: '',
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }, [navigation]);
  const handleTest = () => {
    navigation.navigate('Notification');
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.title_notify}>
          <View style={styles.TitleContainer}>
            <Image
              source={require('../assets/icons/icon_book.png')}
              style={styles.icon}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
              }}>
              <Text style={styles.title}>Book Garden</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleTest();
            }}>
            <Image
              source={require('../assets/icons/notification-bing.png')}
              style={styles.notificationIcon}
            />
            <Text style={styles.bagde} />
          </TouchableOpacity>
        </View>
        <View style={styles.textInputStyle}>
          <Image
            source={require('../assets/icons/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.inputSearch}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Tìm kiếm..."
            onFocus={handleFocusSearch}
            onChangeText={text => setSearch(text)}
          />
          <TouchableOpacity onPress={() => handleDeleteItem()}>
            <Image
              source={require('../assets/icons/icon_delete.png')}
              style={[
                styles.deleteIcon,
                {display: search === '' ? 'none' : 'flex'},
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 30,
  },
  itemStyle: {
    padding: 10,
  },
  deleteIcon: {
    marginTop: 10,
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  textInputStyle: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 5,
    backgroundColor: '#F3F4F6',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 8,
    borderColor: '#F3F4F6',
    color: '#9CA3AF',
    justifyContent: 'space-between',
  },
  bagde: {
    position: 'absolute',
    right: 26,
    top: 0,
    zIndex: 1,
    width: 10,
    height: 10,
    backgroundColor: '#FF3333',
    borderRadius: 20,
  },
  inputSearch: {
    color: '#9CA3AF',
    fontSize: 15,
    width: '80%',
  },
  TitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 5,
    marginLeft: 24,
    marginRight: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Anta-Regular',
  },
  icon: {
    marginRight: 5,
    width: 30,
    height: 30,
    padding: 10,
  },
  searchIcon: {
    marginRight: 5,
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  notificationIcon: {
    marginRight: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    height: 30,
    width: 30,
  },
  title_notify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
});

export default Header;
