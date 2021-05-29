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
import {
  retrieveUserData,
  storeUserData,
  removeUserData,
  retrieveChats,
  storeChats,
  removeChats,
} from '../shared/storage';
import {
  View, Text, Dimensions, StyleSheet, ImageBackground, ActivityIndicator,
} from 'react-native';
import {DrawerContent, DefaultDrawerContent} from '../shared/drawerContent'
import Image from 'react-native-scalable-image';
import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';
import Settings from '../shared/settings'

const backgroundImagePath = '../assets/images/timetable-background.png';
const Drawer = createDrawerNavigator();
const AuthContext = React.createContext();


async function getChatData(userData, setChats, dispatch){
  console.log("fetching chat data");

  // if we fail to download chat data, pull the old one from FS
  const loadOldChatData = async () => {
    let chats;

    try {
      chats = await retrieveChats();
    } catch (e) {}

    if(chats){
      setChats(chats);
      console.log("loaded cached chat data")  ;
    }
    else{
      setChats([]);
    }
  };

  const onSuccess = (response) => {
    if(response['chats']){
      storeChats(response['chats']);
      setChats(response['chats']);
      console.log("chat data synced");
    }
    else{
      loadOldChatData();
    }
  };

  const onFailure = (response) => {
      loadOldChatData();
  };

  fetch(Settings.siteUrl + '/messenger/get_chats/', {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "Token " + userData.token
      },
    })
    .then(response => response.json())
    .then(response => {onSuccess(response)})
    .catch(response => {onFailure(response)})
}


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
    case 'WEBSOCKET_RECONNECT':
      return {
        ...prevState,
        websocket: action.websocket,
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
  const [websocket, setWebsocket] = React.useState(null);
  const [websocketInitialised, setWebsocketInitialised] = React.useState(false);
  const [chats, setChats] = React.useState(null);

  if(websocket === null)
    setWebsocket(new WebSocket(Settings.ws_siteURL + 'messenger/'));

  async function initialiseWebsocket(userData){

    console.log('sending websocket initialisation data.');
    websocket.send(JSON.stringify({
      'action': 'init',
      'data' : {'token': userData.token}
    }));
  }


  if(websocket){

    websocket.onclose = function(){
      setWebsocketInitialised(false);
      console.log('websocket connection has been closed.')
      console.log('attempting to reconnect...')

      setTimeout(
        () => setWebsocket(new WebSocket(Settings.ws_siteURL + 'messenger/')),
        2000
      );
    }

    websocket.onopen = function(e){
      console.log('websocket connection now open.')
      // only should really be run after the web socket is disconnected
      // and reconnected. These functions will get called in the useEffect
      // when the app starts up
      if(state.userData && !websocketInitialised){
        console.log('web init called from *socket open*')
        initialiseWebsocket(state.userData);
        getChatData(state.userData, setChats, dispatch);
      }
    }

    websocket.onmessage = function(e){
      let data = JSON.parse(e.data)
      console.log('websocket recieved: ' + e);
      if(data.message === 'new_message'){
        getChatData(state.userData, setChats, dispatch);
      }
      else if(data.message === 'new_chat'){
        getChatData(state.userData, setChats, dispatch);
        initialiseWebsocket(state.userData);
      }
    }
  }

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const loadUserData = async () => {
      let userData;

      try{
        try {
          userData = await retrieveUserData();
        } catch (e) {
          console.log(e);
        }

        if(userData){
          dispatch({ type: 'RESTORE_USER_DATA', userData: userData });
          getChatData(userData, setChats, dispatch);

          if(userData && !websocketInitialised){
            console.log('web init called from *load user data*')
            setWebsocketInitialised(true)
            initialiseWebsocket(userData);
          }
        }
        else{
          dispatch({ type: 'RESTORE_USER_DATA_FAILED'});
        }
      }
      catch (e) {
        console.log(e);
      }
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
      getUserData: () => { return state.userData },
      getWebSocket: async () => { return state.websocket },
    }),
    []
  );

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
            <Drawer.Screen name="Messenger">
              {props => <MessengerStack chats={chats} userData={state.userData} websocket={websocket} {...props}/>}
            </Drawer.Screen>
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
