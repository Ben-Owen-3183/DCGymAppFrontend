import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TimeTable from '../screens/timeTable';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import React from 'react';
import Header from '../shared/header';

const screens = {
  TimeTable : {
    screen : TimeTable,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Timetable'/>,
      }
    }
  }
};

export const TimeTableStack = createStackNavigator(screens, DefaultNavigationOptions);
