import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TimeTable from '../screens/timeTable';
import BookClass from '../screens/bookClass';
import React from 'react';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';

const Stack = createStackNavigator();

export default function TimeTableStack({ userData, chats, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
          fontSize : 29,
          letterSpacing : 1.5,
        },
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          title: 'TimeTable',
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>
        }}
        name="TimeTable">
        {props => <TimeTable userData={userData} navigation={navigation} {...props}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>
        }}
        name="BookClass"
        component={BookClass} />


    </Stack.Navigator>
  );
}
