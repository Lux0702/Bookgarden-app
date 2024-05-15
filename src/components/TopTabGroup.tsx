// TopTabGroup.js
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomePage from '../pages/HomePage';

const TopTab = createMaterialTopTabNavigator();

const TopTabGroup = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {textTransform: 'capitalize', fontWeight: 'bold'},
        tabBarIndicatorStyle: {
          height: 5,
          borderRadius: 5,
          backgroundColor: '#3697A6',
        },
      }}>
      <TopTab.Screen name="Chờ xác nhận" component={HomePage} />
      <TopTab.Screen name="Đã xác nhận" component={HomePage} />
      <TopTab.Screen name="Đang giao hàng" component={HomePage} />
      <TopTab.Screen name="Đã giao hàng" component={HomePage} />
    </TopTab.Navigator>
  );
};

export default TopTabGroup;
