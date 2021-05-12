import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../shared/header';
import Messenger from '../screens/messenger';
import Chat from '../screens/chat';

const Stack = createStackNavigator();

export default function MessengerStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Messenger'/>
        }}
        name="Messenger"
        component={Messenger} />

      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerTitle: () => <Header back={true} navigation={navigation} title='Messenger'/>
      }}/>



    </Stack.Navigator>
  );
}
