import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TimeTable from '../screens/timeTable';
import React from 'react';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function TimeTableStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949'}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='TimeTable'/>
        }}
        name="TimeTable"
        component={TimeTable} />


    </Stack.Navigator>
  );
}
