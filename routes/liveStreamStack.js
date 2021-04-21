import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LiveStream from '../screens/liveStream';
import React from 'react';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function LiveStreamStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949'}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='LiveStream'/>
        }}
        name="LiveStream"
        component={LiveStream} />

    </Stack.Navigator>
  );
}
