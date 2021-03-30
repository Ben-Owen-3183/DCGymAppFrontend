import {
  createDrawerNavigator
} from 'react-navigation-drawer';
import {
  createAppContainer
} from 'react-navigation';
import { FeedStack } from './feedStack';
import { GymMembershipStack } from './gymMembershipStack';
import { TimeTableStack } from './timeTableStack';
import { LoginStack } from './loginStack';
import { MessengerStack } from './messengerStack';
import { PastStreamStack } from './videosStack';
import { LiveStreamStack } from './liveStreamStack';

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
  Messenger: {
    screen: MessengerStack,
  },
  PastStream: {
    screen: PastStreamStack,
  },
  LiveStream: {
    screen: LiveStreamStack,
  }
});

export default createAppContainer(RootDrawerNavigator);
