import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TimeTable from '../screens/timeTable';
import {DefaultNavigationOptions} from '../styles/dcstyles';

const screens = {
  TimeTable : {
    screen : TimeTable,
    navigationOptions : {
      title : 'TimeTable',
    }
  },
};

export const TimeTableStack = createStackNavigator(screens, DefaultNavigationOptions);
