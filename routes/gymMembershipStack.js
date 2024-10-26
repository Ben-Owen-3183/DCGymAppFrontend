import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GymMembership from '../screens/gymMembership';
import React from 'react';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';

const Stack = createStackNavigator();

export default function GymMembershipStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          paddingTop: Platform.OS === 'android' ? 0 : 7,
          fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
          fontSize : 29,
          letterSpacing : 1.5,
        },
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          title: 'Gym Membership',
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>
        }}
        name="GymMembership"
        component={GymMembership} />


    </Stack.Navigator>
  );
}
