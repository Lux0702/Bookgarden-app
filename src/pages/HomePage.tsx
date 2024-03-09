import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {logout} from '../service/AuthService';
import CarouselComponent from '../components/Carousell';
import tw from 'tailwind-react-native-classnames';
import tai from 'rn-tw';
import ViewPropTypes from 'deprecated-react-native-prop-types';
import Categories from '../components/CategoryComponent'
const HomePage = () => {
  const navigation = useNavigation();
  const handleLogout = () => {
    logout()
      .then(() => navigation.navigate('Login'))
      .catch(error => console.error(error));
    //navigation.navigate('Login')
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={tw`flex-1`}>
        <Header onLogout={handleLogout} />
        <CarouselComponent />
        <Categories />
        <Text style={styles.text}>Hello</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carousell: {
    top: 0,
    alignSelf: 'center',
  },
  text: {
    top: 0,
    marginTop: 0,
  },
});

export default HomePage;
