import {
  createDrawerNavigator
} from 'react-navigation-drawer';
import {
  createAppContainer
} from 'react-navigation';
import FeedStack from './feedStack';
import GymMembershipStack from './gymMembershipStack';
import TimeTableStack from './timeTableStack';
import LoginStack from './loginStack';

const RootDrawerNavigator = createDrawerNavigator({
  Login: {
    screen: LoginStack,
  },
  Feed: {
    screen: FeedStack,
  },
  GymMembership: {
    screen: GymMembershipStack,
  },
  TimeTable: {
    screen: TimeTableStack,
  },
});

export default createAppContainer(RootDrawerNavigator);
