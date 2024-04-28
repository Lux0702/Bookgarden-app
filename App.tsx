import React from 'react';
import {SafeAreaView, StyleSheet, Image, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from './src/constants/Colors';
import HomePage from './src/pages/HomePage';
import CategoriesPage from './src/components/CategoryPage';
import OnboardingPage from './src/pages/OnboardingPage';
import RegisterPage from './src/pages/RegisterPage';
import LoginPage from './src/pages/LoginPage';
import Icon, {Icons} from './src/components/Icons';
import OTPPage from './src/pages/OTPPage';
import ProfilePage from './src/pages/ProfilePage';
import ForgotPassword from './src/pages/ForgotPassword';
import ResetPasssword from './src/pages/ResetPassword';
import UserManager from './src/pages/UserManager';
import ProfileUser from './src/pages/UserProfile';
import BookDetail from './src/pages/BookDetail';
import DetailMore from './src/pages/DetailMore';
import ListBook from './src/pages/ListBook';
import FilterPage from './src/pages/FilterPage';
import SearchPage from './src/pages/SearchPage';
// type RootStackParamList = {
//   BookDetail: {_id: string};
//   Home: undefined;
//   OTP: undefined;
//   Category: undefined;
//   DetailMore: undefined;
//   ProfileUser: undefined;
//   UserManager: undefined;
//   ResetPasssword: undefined;
//   ForgotPassword: undefined;
//   Profile: undefined;
//   Register: undefined;
//   Onboarding: undefined;
//   Login: undefined;
// };
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="ListBook"
            component={ListBook}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchPage"
            component={SearchPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FilterPage"
            component={FilterPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OTP"
            component={OTPPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BookDetail"
            component={BookDetail}
            options={{headerShown: false}}
            // initialParams={{_id: _id}}
          />
          <Stack.Screen
            name="DetailMore"
            component={DetailMore}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileUser"
            component={ProfileUser}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ResetPasssword"
            component={ResetPasssword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfilePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Onboarding"
            component={OnboardingPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Category"
            component={CategoriesPage}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="Trang chủ"
        component={HomePage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/home.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={UserManager}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/cart.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Yêu thích"
        component={UserManager}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/heart.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={UserManager}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/icon_user.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tabLabel: {
    marginTop: 0,
    fontWeight: 'bold',
    top: -10,
  },
  tabIcon: {
    height: 30,
    width: 30,
  },
});

export default App;
