import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TimeTable from '../screens/timeTable';
import BookClass from '../screens/bookClass';
import React from 'react';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function TimeTableStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='TimeTable'/>
        }}
        name="TimeTable"
        component={TimeTable} />

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Book Now'/>
        }}
        name="BookClass"
        component={BookClass} />


    </Stack.Navigator>
  );
}
