import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GymMembership from '../screens/gymMembership';
import React from 'react';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function GymMembershipStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Gym Membership'/>
        }}
        name="GymMembership"
        component={GymMembership} />


    </Stack.Navigator>
  );
}
