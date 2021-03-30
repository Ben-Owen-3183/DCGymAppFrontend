import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import PastStreams from '../screens/videos';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import React from 'react';
import Header from '../shared/header';

const screens = {
  PastStreams : {
    screen : PastStreams,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Past Streams'/>,
      }
    }
  }
};

export const PastStreamStack = createStackNavigator(screens, DefaultNavigationOptions);
