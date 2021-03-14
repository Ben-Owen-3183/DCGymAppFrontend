import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../screens/login';
import CMSignup from '../screens/CMSignup';
import AppSignup from '../screens/appSignup';
import {DefaultNavigationOptions} from '../styles/dcstyles';

const screens = {
  Login : {
    screen : Login,
    navigationOptions : {
      title : 'Login',
    }
  },
  CMSignup : {
    screen : CMSignup,
    navigationOptions : {
      title : 'Club Manager Sign up',
    }
  },
  AppSignup : {
    screen : AppSignup,
    navigationOptions : {
      title : 'Sign up',
    }
  }
};

export const LoginStack = createStackNavigator(screens, DefaultNavigationOptions);
