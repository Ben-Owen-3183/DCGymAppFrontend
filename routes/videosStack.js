import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PastStreams from '../screens/videos';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function LoginStack({ chats, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats}navigation={navigation} title='Videos'/>
        }}
        name="PastStreams"
        component={PastStreams} />

    </Stack.Navigator>
  );
}
