import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import SignupStep1 from '../screens/signupStep1';
import SignupForm from '../screens/signupForm';
import VerifyEmail from '../screens/verifyEmail';
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
          headerTitle: () => <Header navigation={navigation} title='Login'/>
        }}
        name="Login"
        component={Login} />

      <Stack.Screen
        name="SignupStep1"
        component={SignupStep1}
        options={{
          headerTitle: () => <Header navigation={navigation} title='Sign up'/>
      }}/>

      <Stack.Screen
        name="SignupForm"
        component={SignupForm}
        options={{
          headerTitle: () => <Header navigation={navigation} title='Sign up'/>,
        }}
      />

      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{
          headerTitle: () => <Header navigation={navigation} title='Verify Email'/>,
        }}
      />

    </Stack.Navigator>
  );
}



/*
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../screens/login';
import SignupStep1 from '../screens/signupStep1';
import SignupForm from '../screens/signupForm';
import {DefaultNavigationOptions} from '../styles/dcstyles';
import Header from '../shared/header';
import React from 'react';

const screens = {
  Login : {
    screen : Login,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Login'/>,
      }
    }
  },
  SignupStep1 : {
    screen : SignupStep1,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Sign up'/>,
      }
    }
  },
  SignupForm : {
    screen : SignupForm,
    navigationOptions : ({ navigation }) => {
      return {
        headerTitle : () => <Header navigation={navigation} title='Sign up'/>,
      }
    }
  }
};

export const LoginStack = createStackNavigator(screens, DefaultNavigationOptions);
*/
