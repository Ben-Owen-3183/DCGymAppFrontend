import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import GymMembership from '../screens/gymMembership';
import {DefaultNavigationOptions} from '../styles/dcstyles';

const screens = {
  GymMembership : {
    screen : GymMembership,
    navigationOptions : {
      title : 'Join us',
    }
  }
};

export const GymMembershipStack = createStackNavigator(screens, DefaultNavigationOptions);
