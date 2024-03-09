import React, {useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {isLoggedIn} from '../service/AuthService';
const OnboardingSlide = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedIn(); // Kiểm tra trạng thái đăng nhập

      if (loggedIn) {
        navigation.navigate('Home'); // Chuyển hướng đến màn hình Home nếu đã đăng nhập
      } else {
        const timer = setTimeout(() => {
          navigation.navigate('Register');
          console.log('Redirect to Register');
        }, 2000);

        return () => clearTimeout(timer);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/onboarding.png')}
        style={styles.imageBackground}
        resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>
    </View>
  );
};

OnboardingSlide.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    width: Dimensions.get('window').width, // Sử dụng kích thước của cửa sổ để đảm bảo nó chiếm toàn bộ chiều rộng của ImageBackground
    height: Dimensions.get('window').height, // Sử dụng kích thước của cửa sổ để đảm bảo nó chiếm toàn bộ chiều cao của ImageBackground
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default OnboardingSlide;
