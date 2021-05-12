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
import SettingsStack from './settingsStack';
import Header from '../shared/header';
import {retrieveUserData, storeUserData, removeUserData} from '../shared/storage';
import {
  View, Text, Dimensions, StyleSheet, ImageBackground, ActivityIndicator,
} from 'react-native';
import {DrawerContent, DefaultDrawerContent} from '../shared/drawerContent'
import Image from 'react-native-scalable-image';
import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';

const backgroundImagePath = '../assets/images/timetable-background.png';
const Drawer = createDrawerNavigator();
const AuthContext = React.createContext();

function reducer(prevState, action){
  switch (action.type) {
    case 'RESTORE_USER_DATA':
      return {
        ...prevState, // decontructs on return
        userData: action.userData,
        isLoading: false,
      };
    case 'RESTORE_USER_DATA_FAILED':
      return {
        ...prevState,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userData: action.userData,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userData: null,
      };
    case 'UPDATE_USER_DATA':
      return {
        ...prevState,
        userData: action.userData,
      };

  }
}

export default Navigator = ({navigation}) => {

  const initialState = {
    reRender: false,
    isLoading: true,
    isSignout: false,
    userData: null,
  }


  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const loadUserData = async () => {
      let userData;

      try {
        userData = await retrieveUserData();
      } catch (e) {

      }

      if(userData)
        dispatch({ type: 'RESTORE_USER_DATA', userData: userData });
      else
        dispatch({ type: 'RESTORE_USER_DATA_FAILED'});
    };

    loadUserData();
  }, []);


  const authContext = React.useMemo(
    () => ({
      setUserData: async userData => {
        dispatch({ type: 'SIGN_IN', userData: userData });
      },
      updateUserData: async userData => {
        dispatch({ type: 'UPDATE_USER_DATA', userData: userData });
      },
      signOut: () => {
        removeUserData();
        dispatch({ type: 'SIGN_OUT' })
      },
      getUserData: () => { return state.userData }
    }),
    []
  );

  //if (true) {
  if (state.isLoading) {
    return (

      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            width={Dimensions.get('window').width*0.9}
            source={require('../assets/images/dclogo.png')}/>
          <Text style={{fontSize: 25, marginTop: 30,marginBottom: 20, textAlign: 'center', color: '#FFC300'}} > Signing in </Text>
          <ActivityIndicator color={'#FFC300'} size={80} />
        </View>
      </ImageBackground>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userData == null ? (
          <Drawer.Navigator
            drawerStyle={{ backgroundColor: ''}}
            drawerContent={props => <DefaultDrawerContent {...props}/>}>
            <Drawer.Screen name="Login" component={LoginStack} />
            <Drawer.Screen name="Gym Membership" component={GymMembershipStack}/>
          </Drawer.Navigator>
        ) : (
          <Drawer.Navigator
            drawerStyle={{ width: '75%', backgroundColor: ''}}
            drawerContent={props => <DrawerContent userData={state.userData} {...props}/>}>
            <Drawer.Screen name="TimeTable" component={TimeTableStack} />
            <Drawer.Screen name="Feed" component={FeedStack}/>
            <Drawer.Screen name="Messenger" component={MessengerStack} />
            <Drawer.Screen name="Videos" component={PastStreamStack} />
            <Drawer.Screen name="Live Stream" component={LiveStreamStack} />
            <Drawer.Screen name="Settings" component={SettingsStack} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export {AuthContext};

const styles = StyleSheet.create({
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
});
