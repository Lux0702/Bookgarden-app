import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedRef } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function ColorScreen({ route }) {
  const navigation = useNavigation(); // Sử dụng hook useNavigation để lấy object navigation
  const viewRef = useAnimatedRef(null);

  // Kiểm tra nếu route có tên là 'Category', chuyển hướng đến màn hình CategoryPage
  if (route.name === 'Category') {
    navigation.navigate('Category'); // Chuyển hướng đến màn hình có tên là 'CategoryPage'
  }

  // Kiểm tra nếu route có tên là 'Login', chuyển hướng đến màn hình LoginPage
  if (route.name === 'Login') {
    navigation.navigate('Login'); // Chuyển hướng đến màn hình có tên là 'LoginPage'
  }
  if (route.name === 'Home') {
    navigation.navigate('Home'); // Chuyển hướng đến màn hình có tên là 'LoginPage'
  }
  return (
    <Animated.View
      ref={viewRef}
      entering={FadeIn.duration(800)}
      style={styles.container}>
      <View style={styles.container} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
