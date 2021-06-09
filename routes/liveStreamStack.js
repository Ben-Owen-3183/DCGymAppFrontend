import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LiveStream from '../screens/liveStream';
import React from 'react';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function LiveStreamStack({ chats, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='LiveStream'/>
        }}
        name="LiveStream"
        component={LiveStream} />

    </Stack.Navigator>
  );
}
