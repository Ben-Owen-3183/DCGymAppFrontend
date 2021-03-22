import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import WebView from 'react-native-webview'

const GymMembership = () => {
  return (
    <WebView source={{ uri: 'https://davidcorfieldfitness.clubm.mobi/Member/Joining.mvc' }}/>
  );
}

export default GymMembership;
