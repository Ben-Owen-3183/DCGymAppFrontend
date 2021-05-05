import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../shared/header';


import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';

const Stack = createStackNavigator();

export default function SettingsStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949'}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Set Avatar'/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="SetAvatar"
        component={SetAvatar}
      />

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Change Password'/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="ChangePassword"
        component={ChangePassword}
      />


    </Stack.Navigator>
  );
}
