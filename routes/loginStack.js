import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../screens/login';
import CMSignup from '../screens/CMSignup';
import AppSignup from '../screens/appSignup';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import Header from '../shared/header';
import React from 'react';

const screens = {
  Login : {
    screen : Login,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Login'/>,
      }
    }
  }
};

export const LoginStack = createStackNavigator(screens, DefaultNavigationOptions);
