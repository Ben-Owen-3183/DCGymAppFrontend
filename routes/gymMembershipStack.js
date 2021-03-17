import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import GymMembership from '../screens/gymMembership';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import React from 'react';
import Header from '../shared/header';

const screens = {
  GymMembership : {
    screen : GymMembership,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Gym Membership'/>,
      }
    }
  }
};

export const GymMembershipStack = createStackNavigator(screens, DefaultNavigationOptions);
