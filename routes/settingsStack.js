import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';
import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';
import ChangePasswordSuccess from '../screens/changePasswordSuccess';
import ResetCache from '../screens/resetCache';

const Stack = createStackNavigator();

export default function SettingsStack({ chats, navigation }) {
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
          headerRight: (props) => <HeaderRight chats={chats} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="SetAvatar"
        component={SetAvatar}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="Reset Cache"
        component={ResetCache}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="Change Password"
        component={ChangePassword}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
        }}
        name="Change Password Success"
        component={ChangePasswordSuccess}
      />


    </Stack.Navigator>
  );
}
