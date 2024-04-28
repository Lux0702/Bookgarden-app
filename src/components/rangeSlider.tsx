import React from 'react';
import {View, StyleSheet} from 'react-native';

interface ThumbProps {
  name: 'high' | 'low'; // Thêm định nghĩa cho props name
}

const Thumb: React.FC<ThumbProps> = ({name}) => {
  return <View style={styles.thumb} />;
};
const Rail = () => {
  return <View style={styles.rail} />;
};

const RailSelected = () => {
  return <View style={styles.railSelected} />;
};

const styles = StyleSheet.create({
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  rail: {
    flex: 1,
    height: 4,
    backgroundColor: 'lightgrey',
  },
  railSelected: {
    flex: 1,
    height: 4,
    backgroundColor: 'blue',
  },
});

export {Thumb, Rail, RailSelected};
