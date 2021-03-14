import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';

const Login = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}> login screen </Text>
    </View>
  );
}

export default Login;
