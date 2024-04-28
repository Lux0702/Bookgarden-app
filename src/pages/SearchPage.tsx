import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchPage = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const textInputRef = useRef<TextInput>(null);
  let [searchResults, setSearchResults] = useState<string[]>([]);
  useEffect(() => {
    loadSearchResults();
  }, []);
  useEffect(() => {
    saveSearchResults();
  }, [searchResults]);
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);
  const loadSearchResults = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('searchResults');
      if (jsonValue !== null) {
        setSearchResults(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading search results:', e);
    }
  };

  const saveSearchResults = async () => {
    try {
      const jsonValue = JSON.stringify(searchResults);
      await AsyncStorage.setItem('searchResults', jsonValue);
    } catch (e) {
      console.error('Error saving search results:', e);
    }
  };
  const handleSearch = () => {
    if (search !== '') {
      setSearchResults(prevSearchResults => [...prevSearchResults, search]);
      navigation.navigate('ListBook', {
        searchKey: search,
      });
    }
  };
  const handleDeleteItem = (index: number) => {
    setSearchResults(prevSearchResults => {
      const newResults = [...prevSearchResults];
      newResults.splice(index, 1);
      return newResults;
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/icons/back-icon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.textInputContainer}>
            <TouchableOpacity
              onPress={() => {
                handleSearch();
              }}>
              <Image
                source={require('../assets/icons/search.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.inputSearch}
              value={search}
              underlineColorAndroid="transparent"
              placeholder="Tìm kiếm..."
              onChangeText={text => setSearch(text)}
              ref={textInputRef}
            />
            <TouchableOpacity
              onPress={() => {
                setSearch('');
              }}>
              <Image
                source={require('../assets/icons/icon_delete.png')}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Lịch sử tìm kiếm</Text>
          <TouchableOpacity
            onPress={() => {
              setSearchResults([]);
            }}>
            <Image
              source={require('../assets/icons/icon_delete.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.historySearch}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ListBook', {
                      searchKey: item,
                    });
                  }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                  <Image
                    source={require('../assets/icons/icon_delete.png')}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  titleContainer: {
    marginTop: 5,
    // ...tw`flex items-center justify-start `,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.3,
  },
  historySearch: {
    marginTop: 5,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    color: '#1C2A3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 3,
  },
  inputSearch: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  searchIcon: {
    marginRight: 5,
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  deleteIcon: {
    marginRight: 5,
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
});

export default SearchPage;
