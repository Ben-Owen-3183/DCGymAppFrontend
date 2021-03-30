import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import React from 'react';
import Header from '../shared/header';
import Messenger from '../screens/messenger';
import Chat from '../screens/chat';

const screens = {
  Messenger : {
    screen : Messenger,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Messenger'/>,
      }
    }
  },
  Chat : {
    screen : Chat,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header back={true} navigation={navigation} title='Messenger'/>,
      }
    }
  }
};

export const MessengerStack = createStackNavigator(screens, DefaultNavigationOptions);
