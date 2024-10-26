import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import SignupStep1 from '../screens/signupStep1';
import SignupForm from '../screens/signupForm';
import VerifyEmail from '../screens/verifyEmail';
import ForgottenPassword from '../screens/forgottenPassword';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';

const Stack = createStackNavigator();

export default function LoginStack({ navigation }) {
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
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0, elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>
        }}
        name="Login"
        component={Login} />

      <Stack.Screen
        name="SignupStep1"
        component={SignupStep1}
        options={{
          title: 'Signup',
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>
      }}/>

      <Stack.Screen
        name="SignupForm"
        component={SignupForm}
        options={{
          title: 'Signup', 
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>,
        }}
      />

      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{
          title: 'Verify Email',
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>,
        }}
      />

      <Stack.Screen
        name="ForgottenPassword"
        component={ForgottenPassword}
        options={{
          title: 'Forgotten Password',
          headerRight: (props) => <HeaderRight navigation={navigation} {...props}/>,
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
