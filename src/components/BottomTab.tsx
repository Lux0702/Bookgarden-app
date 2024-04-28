import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import Icon, {Icons} from '../components/Icons';
import Colors from '../constants/Colors';
import {ScreenComponents} from '../constants/Screen';
import tw from 'tailwind-react-native-classnames';
import * as Animatable from 'react-native-animatable';
import {ZoomIn} from 'react-native-reanimated';

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: Icons.Ionicons,
    activeIcon: 'grid',
    inActiveIcon: 'grid-outline',
    component: ScreenComponents.HomePage,
  },
  {
    route: 'Like',
    label: 'Like',
    type: Icons.MaterialCommunityIcons,
    activeIcon: 'heart-plus',
    inActiveIcon: 'heart-plus-outline',
    component: ScreenComponents.LoginPage,
  },
  {
    route: 'Search',
    label: 'Search',
    type: Icons.MaterialCommunityIcons,
    activeIcon: 'timeline-plus',
    inActiveIcon: 'timeline-plus-outline',
    component: ScreenComponents.RegisterPage,
  },
  {
    route: 'Account',
    label: 'Account',
    type: Icons.FontAwesome,
    activeIcon: 'user-circle',
    inActiveIcon: 'user-circle-o',
    component: ScreenComponents.LoginPage,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = ({item, onPress, focused}: any) => {
  const viewRef = useRef<Animatable.View | null>(null);
  useEffect(() => {
    if (focused && viewRef.current) {
      viewRef.current.animate({
        0: {scaleX: 0.5, translateY: 7},
        0.92: {translateY: -34},
        1: {scaleX: 1.2, translateY: -24},
      });
    } else if (viewRef.current) {
      viewRef.current.animate({
        0: {scaleX: 1.2, translateY: -24},
        1: {scaleX: 1, translateY: 7},
      });
    }
  }, [focused]);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <View style={styles.btn}>
        <Animatable.View ref={viewRef} animation="zoomIn" duration={2000}>
          <Icon
            type={item.type}
            name={focused ? item.activeIcon : item.inActiveIcon}
            color={focused ? Colors.white : Colors.primary}
          />
        </Animatable.View>

        {/* <Text style={styles.text}>{item.label}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const AnimTab1 = () => {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}>
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: false,
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({focused}) => (
                  <Icon
                    type={item.type}
                    name={focused ? item.activeIcon : item.inActiveIcon}
                    color={focused ? Colors.primary : Colors.primaryLite}
                  />
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    margin: 16,
    borderRadius: 16,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default AnimTab1;
