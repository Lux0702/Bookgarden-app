// App.tsx hoặc App.js
import React from 'react';
import {SafeAreaView} from 'react-native';
import OnboardingPage from './src/pages/OnboardingPage';
import RegisterPage from './src/pages/RegisterPage';
import LoginPage from './src/pages/LoginPage';
import HomePage from './src/pages/HomePage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Onboarding"
            component={OnboardingPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default App;
