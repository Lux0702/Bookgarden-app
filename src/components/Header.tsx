import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const Header = ({onLogout}) => {
  const [search, setSearch] = useState('');
  //   const [filteredDataSource, setFilteredDataSource] = useState([]);
  //   const [masterDataSource, setMasterDataSource] = useState([]);
  //   const [showFlatList, setShowFlatList] = useState(false); // Biến trạng thái để xác định xem có hiển thị FlatList hay không

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.title_notify}>
          <View style={styles.TitleContainer}>
            <Image
              source={require('../assets/icons/icon_book.png')}
              style={styles.icon}
            />
            <Text style={styles.title}>Book Garden</Text>
          </View>
          <TouchableOpacity onPress={onLogout}>
            <Image
              source={require('../assets/icons/notification-bing.png')}
              style={styles.notificationIcon}
            />
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
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 30,
    // flex: 1,
  },
  itemStyle: {
    padding: 10,
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
  },
  inputSearch: {
    color: '#9CA3AF',
    fontSize: 15,
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
});

export default Header;
