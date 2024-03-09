import React from 'react';
import {View, StyleSheet} from 'react-native';
import OnboardingSlide from '../components/OnboardingSlide';
// import onboarding from '../assets/images/onboarding.png';
// import data from '../assets/data';
import {useNavigation} from '@react-navigation/native';
const OnboardingPage = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <OnboardingSlide navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingPage;
