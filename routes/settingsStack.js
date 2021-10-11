import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';
import Computeit from '../screens/compute-it';
import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';
import ChangePasswordSuccess from '../screens/changePasswordSuccess';
import ResetCache from '../screens/resetCache';

const Stack = createStackNavigator();

export default function SettingsStack({ chats, navigation, userData }) {
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
          title: 'Set Avatar'
        }}
        name="SetAvatar"
        component={SetAvatar}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
          title: 'Compute IT LTD'
        }}
        name="Computeit"
        component={Computeit}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
          title: 'Reset Cache'
        }}
        name="ResetCache"
        component={ResetCache}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight title={'hello'} chats={chats} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
          title: 'Change Password'
        }}
        name="ChangePassword"
        component={ChangePassword}
      />

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>,
          headerLeft: () => {
            return null;
          },
          title: 'Change Password Success'
        }}
        name="ChangePasswordSuccess"
        component={ChangePasswordSuccess}
      />


    </Stack.Navigator>
  );
}
