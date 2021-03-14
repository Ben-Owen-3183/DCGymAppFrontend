import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';

const TimeTable = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}> Class Timetable </Text>
    </View>
  );
}

export default TimeTable;
