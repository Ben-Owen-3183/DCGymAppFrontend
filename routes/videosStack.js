import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PastStreams from '../screens/videos';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function LoginStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949'}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Videos'/>
        }}
        name="PastStreams"
        component={PastStreams} />

    </Stack.Navigator>
  );
}
