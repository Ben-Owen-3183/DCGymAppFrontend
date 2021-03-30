import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import LiveStream from '../screens/liveStream';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import React from 'react';
import Header from '../shared/header';

const screens = {
  LiveStream : {
    screen : LiveStream,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Live Stream'/>,
      }
    }
  }
};

export const LiveStreamStack = createStackNavigator(screens, DefaultNavigationOptions);
