import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import Header from '../components/Header';
import tw from 'tailwind-react-native-classnames';
import {useCategoryData} from '../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryProp {
  id: string;
  categoryName: string;
}
const CategoriesPage = ({navigation}: any) => {
  const {
    categories,
    fetchCategory,
  }: {categories: any; fetchCategory: () => void} = useCategoryData();
  const [spining, setSpining] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpining(true);
        await fetchCategory();
      } catch {
        console.log('error');
      } finally {
        setSpining(false);
      }
    };
    fetchData();
  }, []);
  // const animateBack = () => {
  //   Animated.timing(animation, {
  //     toValue: width, // Điều chỉnh giá trị kết thúc của animation
  //     duration: 500, // Thời gian của animation
  //     useNativeDriver: true,
  //   }).start(() => {});
  // };
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header onLogout={undefined} navigation={navigation} />
      <ScrollView>
        <View style={styles.titlecontainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={require('../assets/icons/back-icon.png')} />
          </TouchableOpacity>
          <Text style={styles.category}>Thể loại</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.categoryContainer}>
            {categories.slice(0, 8).map((item: CategoryProp) => (
              <Pressable
                key={item.id}
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
                <Text style={styles.textTitle}> {item.categoryName} </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <Spinner
        visible={spining}
        textContent={'Đang tải...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 0.5)"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  spinnerTextStyle: {
    color: '#1C2A3A',
  },
  animatedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Màu nền của Animated.View
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  titlecontainer: {
    width: '90%',
    height: 70,
    lineHeight: 35,
    padding: 20,
    flexDirection: 'row',
  },
  textTitle: {
    fontSize: 16,
    height: 40,
    width: 140,
    color: '#262626',
    borderRadius: 45,
    borderColor: 'black',
    backgroundColor: '#ccc',
    borderStyle: 'solid',
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    margin: 10,
  },
  category: {
    fontSize: 16,
    width: 100,
    color: '#262626',
    textAlign: 'center',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoriesPage;
