import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Feed from '../screens/feed';
import {DefaultNavigationOptions} from '../styles/dcstyles';

const screens = {
  Feed : {
    screen : Feed,
    navigationOptions : {
      title : 'Feed',
    }
  }
};



export const FeedStack = createStackNavigator(screens, DefaultNavigationOptions);
