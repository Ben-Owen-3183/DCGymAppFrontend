import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../shared/header';


import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';
import ChangePasswordSuccess from '../screens/changePasswordSuccess';
import ResetCache from '../screens/resetCache';

const Stack = createStackNavigator();

export default function SettingsStack({ chats, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Set Avatar'/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="SetAvatar"
        component={SetAvatar}
      />

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Reset Cache'/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="ResetCache"
        component={ResetCache}
      />

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Change Password'/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="ChangePassword"
        component={ChangePassword}
      />

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Success'/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="ChangePasswordSuccess"
        component={ChangePasswordSuccess}
      />


    </Stack.Navigator>
  );
}
