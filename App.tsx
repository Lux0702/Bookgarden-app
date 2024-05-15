/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomePage from './src/pages/HomePage';
import CategoriesPage from './src/components/CategoryPage';
import OnboardingPage from './src/pages/OnboardingPage';
import RegisterPage from './src/pages/RegisterPage';
import LoginPage from './src/pages/LoginPage';
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
import Wishlist from './src/pages/Wishlist';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReviewMore from './src/pages/reviewMore';
import CartPage from './src/pages/CartPage';
import OrderPage from './src/pages/OrderPage';
import HistoryPage from './src/pages/HistoryOrder';
import Notification from './src/pages/Notification';
import AddressPage from './src/pages/AddressPage';
import AddAddress from './src/pages/AddAddress';
import EditAddress from './src/pages/EditAddress';
import {navigationRef} from './src/utils/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';

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
// const NAVIGATION_IDS = ['home', 'settings'];

// function buildDeepLinkFromNotificationData(data: any): string | null {
//   const navigationId = data?.navigationId;
//   if (!NAVIGATION_IDS.includes(navigationId)) {
//     console.warn('Unverified navigationId', navigationId);
//     return null;
//   }
//   if (navigationId === 'home') {
//     return 'myapp://home';
//   }
//   if (navigationId === 'settings') {
//     return 'myapp://settings';
//   }

//   return null;
// }

// const linking = {
//   prefixes: ['myapp://'],
//   config: {
//     screens: {
//       Home: 'home',
//       Settings: 'settings',
//     },
//   },
//   async getInitialURL() {
//     const url = await Linking.getInitialURL();
//     if (typeof url === 'string') {
//       return url;
//     }
//     //getInitialNotification: When the application is opened from a quit state.
//     const message = await messaging().getInitialNotification();
//     const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
//     if (typeof deeplinkURL === 'string') {
//       return deeplinkURL;
//     }
//   },
//   subscribe(listener: (url: string) => void) {
//     const onReceiveURL = ({url}: {url: string}) => listener(url);

//     // Listen to incoming links from deep linking
//     const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Message handled in the background!', remoteMessage);
//     });

//     const foreground = messaging().onMessage(async remoteMessage => {
//       console.log('A new FCM message arrived!', remoteMessage);
//     });
//     //onNotificationOpenedApp: When the application is running, but in the background.
//     const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
//       const url = buildDeepLinkFromNotificationData(remoteMessage.data);
//       if (typeof url === 'string') {
//         listener(url);
//       }
//     });

//     return () => {
//       linkingSubscription.remove();
//       unsubscribe();
//       foreground();
//     };
//   },
// };
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const App = () => {
  // useEffect(() => {
  //   const requestUserPermission = async () => {
  //     try {
  //       await messaging().requestPermission();
  //       const token = await messaging().getToken();
  //       console.log('FCM token:', token);
  //     } catch (error) {
  //       console.log('Permission request error:', error);
  //     }
  //   };
  //   requestUserPermission();
  // }, []);
  useEffect(() => {
    SplashScreen?.hide();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{headerShown: false}}
          />
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
            name="AddressPage"
            component={AddressPage}
            options={{
              headerShown: true,
              title: ' Chọn địa chỉ nhận hàng',
              headerTitleAlign: 'center',
              headerStyle: {borderBottomWidth: 0.5},
            }}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddress}
            options={{
              headerShown: true,
              title: ' Thêm địa chỉ nhận hàng',
              headerTitleAlign: 'center',
              headerStyle: {borderBottomWidth: 0.5},
            }}
          />
          <Stack.Screen
            name="EditAddress"
            component={EditAddress}
            options={{
              headerShown: true,
              title: ' Sửa địa chỉ nhận hàng',
              headerTitleAlign: 'center',
              headerStyle: {borderBottomWidth: 0.5},
            }}
          />
          <Stack.Screen
            name="DetailMore"
            component={DetailMore}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{
              headerShown: true,
              title: 'Thông báo',
              headerTitleAlign: 'center',
              headerBackgroundContainerStyle: styles.header,
            }}
          />
          <Stack.Screen
            name="ProfileUser"
            component={ProfileUser}
            options={{
              headerShown: true,
              title: 'Thông tin cá nhân',
              headerTitleAlign: 'center',
            }}
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
            name="ReviewMore"
            component={ReviewMore}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Category"
            component={CategoriesPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderPage"
            component={OrderPage}
            options={{
              headerShown: true,
              title: 'Đặt hàng',
              headerStyle: {borderBottomWidth: 0.5},
            }}
          />
          <Stack.Screen
            name="HistoryPage"
            component={HistoryPage}
            options={{
              headerShown: true,
              title: 'Lịch sử đơn hàng',
              headerStyle: {borderBottomWidth: 0.5},
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
      // screenOptions={{
      //   headerShown: false,
      //   tabBarStyle: styles.tabBar,
      //   tabBarLabelStyle: styles.tabLabel,
      // }}
      screenOptions={({route, navigation}) => ({
        tabBarOnPress: () => {
          navigation.navigate(route.name); // Chuyển đến tab được chọn
        },
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}>
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
        component={CartPage}
        options={({navigation}) => ({
          headerShown: true,
          headerShadowVisible: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              style={{marginLeft: 10}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: {
            elevation: 5,
          },
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/cart.png')}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Yêu thích"
        component={Wishlist}
        options={({navigation}) => ({
          headerShown: true,
          headerShadowVisible: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              style={{marginLeft: 10}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: {
            elevation: 5,
          },
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/heart.png')}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Cá nhân"
        component={UserManager}
        options={() => ({
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require('./src/assets/icons/icon_user.png')}
            />
          ),
        })}
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
  header: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    elevation: 2,
  },
});

export default App;
