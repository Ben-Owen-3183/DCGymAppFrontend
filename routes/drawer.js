import React, {useState} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import FeedStack from './feedStack';
import GymMembershipStack from './gymMembershipStack';
import TimeTableStack from './timeTableStack';
import LoginStack from './loginStack';
import MessengerStack from './messengerStack';
import PastStreamStack from './videosStack';
import LiveStreamStack from './liveStreamStack';
import Header from '../shared/header';
import {getToken, storeToken, deleteToken} from '../shared/storage';
import {
  View, Text
} from 'react-native';
import DrawerContent from '../shared/drawerContent'

const Drawer = createDrawerNavigator();
const AuthContext = React.createContext();

function reducer(prevState, action){
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState, // decontructs on return
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
  }
}

export default Navigator = ({navigation}) => {

  const [state, dispatch] = React.useReducer(reducer, { // our state
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );


  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const loadToken = async () => {
      let token;

      try {
        token = await getToken();
        console.log("get token: " + token);
      } catch (e) {
        console.log("failed at fetching user token")
      }
      dispatch({ type: 'RESTORE_TOKEN', token: token });
    };

    loadToken();
  }, []);


  const authContext = React.useMemo(
    () => ({
      setToken: async token => {
        dispatch({ type: 'SIGN_IN', token: token });
      },
      signOut: () => {
        deleteToken();
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async token => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  if (state.isLoading) {
    return <Text> Attemping automatic login... </Text>;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Drawer.Navigator>
            <Drawer.Screen name="Login" component={LoginStack} />
            <Drawer.Screen name="Gym GymMembership" component={GymMembershipStack}/>
          </Drawer.Navigator>
        ) : (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
            <Drawer.Screen name="Feed" component={FeedStack}/>
            <Drawer.Screen name="Time TimeTable" component={TimeTableStack} />
            <Drawer.Screen name="Messenger" component={MessengerStack} />
            <Drawer.Screen name="Videos" component={PastStreamStack} />
            <Drawer.Screen name="Live Stream" component={LiveStreamStack} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export {AuthContext};





/*
export default Navigator = ({navigation}) => {
  const [token, setToken] = useState('');

  getToken()
    .then((data) => setToken(data))

  return(
    <NavigationContainer>
      {token ? (
        <Drawer.Navigator drawerContent={props => <DrawerContent {... props}/>}>
          <Drawer.Screen name="Feed" component={FeedStack}/>
          <Drawer.Screen name="Time TimeTable" component={TimeTableStack} />
          <Drawer.Screen name="Messenger" component={MessengerStack} />
          <Drawer.Screen name="Videos" component={PastStreamStack} />
          <Drawer.Screen name="Live Stream" component={LiveStreamStack} />
        </Drawer.Navigator>
          ) : (
        <Drawer.Navigator>
          <Drawer.Screen name="Login" component={LoginStack} />
          <Drawer.Screen name="Gym GymMembership" component={GymMembershipStack}/>
        </Drawer.Navigator>
        )}

    </NavigationContainer>
  );
}
*/



/*
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
*/
