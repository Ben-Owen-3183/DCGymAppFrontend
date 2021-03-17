import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Feed from '../screens/feed';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import React from 'react';
import Header from '../shared/header';

const screens = {
  Feed : {
    screen : Feed,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Feed'/>,
      }
    }
  }
};

export const FeedStack = createStackNavigator(screens, DefaultNavigationOptions);
