import React, {useState} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer} from '@react-navigation/native';
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
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {DrawerContent, DefaultDrawerContent} from '../shared/drawerContent'
import Image from 'react-native-scalable-image';
import SetAvatar from '../screens/setAvatar';
import ChangePassword from '../screens/changePassword';
import Settings from '../shared/settings'
import moment from 'moment'
import Storage from '../shared/storage';
import messaging from '@react-native-firebase/messaging';

const backgroundImagePath = '../assets/images/timetable-background.png';
const Drawer = createDrawerNavigator();
const AuthContext = React.createContext();

let signOutHook;

function findChat(chats, chat_id){
  for (var i = 0; i < chats.length; i++)
    if(chats[i].id.toString() === chat_id.toString())
      return chats[i];
  return null;
}

// orders chats by datetime of last message
function sortChats(chats, setChats){
  if(chats && chats.length > 1){
    chats.sort(function(a, b){
      return moment(b.messages[0].datetime).diff(
        moment(a.messages[0].datetime));
    });
    let newChats = []
    Object.assign(newChats, chats);
    storeChats(chats);
    setChats(chats);
  }
}

function createSyncChatsPayload(chats){
  let payload = {
    chats_data: []
  };
  if(!chats || chats == undefined || chats == null) return payload;

  for (var i = 0; i < chats.length; i++) {
    if(chats[i].messages.length > 0){
      payload.chats_data.push({
        chat_id: chats[i].id,
        last_message_id: chats[i].messages[0].id,
        last_message_time: chats[i].messages[0].datetime,
      })
    }
  }

  return payload;
}

/* 
Removes any duplicate messages that can arise
*/
function removeDuplicateMessagesFromNewChats(chat, newChat){
  console.log('removing dupes!!!!!!!!!!');
  var dupeSafeMessages = [];
  for(var i = 0; i < newChat.messages.length; i++) {
    var currentMsg = newChat.messages[i];
    if(!messageAlreadyExistsInChat(currentMsg.id, chat))
      dupeSafeMessages.push(currentMsg);
  }
  return dupeSafeMessages;
}

function messageAlreadyExistsInChat(id, chat){
  for(var i = 0; i < chat.messages.length; i++)
    if(chat.messages[i].id.toString() === id.toString())
      return true;
  return false;
}

// merges the synced chat data from the server with
// the local chat data
function mergeNewChatData(chats, setChats, data){

  // add new messages to existing chats
  if(data.new_chat_messages){
    for (var i = 0; i < data.new_chat_messages.length; i++) {
      let chat = findChat(chats, data.new_chat_messages[i].chat_id);
      if(chat){
        chat.read = false;
        var dupeSafeMessages = removeDuplicateMessagesFromNewChats(chat, data.new_chat_messages[i]);
        chat.messages = dupeSafeMessages.concat(chat.messages);
      }
    }
  }

  let newChats = []
  // Add new chats from response to chats
  newChats = newChats.concat(data.new_chats);
  newChats = newChats.concat(chats);

  // fiddle to trick useState
  let chatNewList = []
  Object.assign(chatNewList, newChats)

  storeChats(chatNewList);
  setChats(chatNewList);
}

async function syncChats(userData, chats, setChats){
  try {
    let response = await fetch(Settings.siteUrl + '/messenger/sync_chat/', {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "Token " + userData.token
      },
      body: JSON.stringify(createSyncChatsPayload(chats))
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json();
    if(!data) throw 'empty response';

    if((data['new_chats'] && data['new_chats'].length > 0) || (data['new_chat_messages'] && data['new_chat_messages'].length > 0)){
      mergeNewChatData(chats, setChats, data);
    }

  } catch (e) {
    console.log(`Error Chat Sync: ${e}`);
  }
}

async function fetchAndAddChat(userData, chat_id, chats, setChats){
  try{
    let response = await fetch(Settings.siteUrl + '/messenger/get_chat/', {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "Token " + userData.token
      },
      body: JSON.stringify({
        'chat_id': chat_id
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json();

    if(!data || data['errors'] && data.other_user_data) throw 'no chat returned';
    // console.log(`Fetched Chat data:  ${JSON.stringify(data)}`);
    console.log(`Fetched Chat data`);
    chats.push(data);
    let newChats = []
    Object.assign(newChats, chats);
    storeChats(newChats);
    setChats(newChats);
  }catch(e){
    console.log(`Fetching Chat: ${e}`)
  }
}

async function addNewChatMessage(chats, setChats, userData, data){

  let newMessage = data.message;
  let chat_id = data.message.chat_id;
  let read = data.read[userData.user_id.toString()];


  try{
    let chat = findChat(chats, chat_id)
    if(!chat) throw 'NO_CHAT_FOUND';
    if(messageAlreadyExistsInChat(newMessage.id, chat)) throw 'duplicate message found and not added to chat.'
    chat.read = read;
    chat.messages.unshift(newMessage);
    let newChats = []
    Object.assign(newChats, chats);
    storeChats(newChats);
    setChats(newChats);

  }catch(e){
    console.log(`Adding New Chat Message: ${e}`)
    if(e === 'NO_CHAT_FOUND'){
      data.chat_data.push
      createNewChatWithNewMessages(data.chat_data, newMessage, chats, setChats);
    }
    // fetchAndAddChat(userData, chat_id, chats, setChats);
  }
}

async function createNewChatWithNewMessages(chat_data, newMessage, chats, setChats){
  try {
    chat_data.messages = [newMessage];
    let newChats = [];
    Object.assign(newChats, chats);
    newChats.push(chat_data);
    setChats(newChats);
    storeChats(newChats);
  } catch (e) {
    console.log(`New Chat From New Message ${e}`);
  }
}

async function loadCachedChatData(){
  try {
    let chats = await retrieveChats();
    // console.log(`Cached chat data: ${JSON.stringify(chats)}`);
    return chats;
  } catch (e) {
    console.log(`Error Chat Get Cached: ${e}`);
    return [];
  }
}

async function subscribeToNewChatOnServer(userData, websocket, chats, setChats){
  try {
    await syncChats(userData, chats, setChats);

    // subscribe to new chat in websocket
    websocket.send(JSON.stringify({
      'action': 'add_new_chat',
      'data' : {
        'token': userData.token
      }
    }));
  } catch (e) {
    console.log(`WS NEW CHAT: ${e}`);
  }
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
        signedIn: true,
        userData: action.userData,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        signedIn: false,
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

async function fetchUserdata(token){
  try{
    let response = await fetch(Settings.siteUrl + '/auth/user_data/', {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        token: token
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json();
    if(data['error']) throw data['error'];
    return data;

  }catch(e){
    console.log(`Fetch User Data Error: ${e}`);
  }
  return null;
}

export default Navigator = (props) => {
  const initialState = {
    reRender: false,
    isLoading: true,
    signedIn: false,
    userData: null,
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [websocket, setWebsocket] = React.useState(null);
  const [websocketInitialised, setWebsocketInitialised] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const [initialRoute, setInitialRoute] = React.useState(Settings.homePage);

  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
  
    if (authorizationStatus) {
      // console.log('Permission status:', authorizationStatus);
    }
  }

  requestUserPermission();

  if(websocket !== null && state.signedIn === false && state.userData === null){
    console.log('closing websocket...');
    try {
      websocket.close();
    } catch (e) {
      console.log(e);
    }
  }

  function initialiseWebsocket(userData){
    try{
      console.log('sending websocket initialisation data.');
      websocket.send(JSON.stringify({
        'action': 'init',
        'data' : {'token': userData.token}
      }));
      setWebsocketInitialised(true);
    }
    catch(e){
      console.log(`IntialiseWebsocket: ${e}`);
      setWebsocketInitialised(false);
    }
  }

  async function initialiseApp() {
    try {
      let userData = state.userData;
      if(!userData){
        userData = await retrieveUserData();
        try {
          if(userData) {
            response = await fetchUserdata(userData.token);
            if(!response && response['user_data']) userData = response['user_data'];
          }
        } catch (e) {}
      }


      let cachedChats = await loadCachedChatData();
      if(cachedChats.length > 0) setChats(cachedChats);

      if(userData){
        // start websocket
        console.log('Creating websocket connection');
        state.signedIn = true;
        setWebsocket(new WebSocket(Settings.ws_siteURL + 'messenger/'));


        dispatch({ type: 'RESTORE_USER_DATA', userData: userData });

        await syncChats(userData, cachedChats, setChats);

        sortChats(chats, setChats);

        /*
        if(!websocketInitialised){

          // console.log('web init called from *Initialise App*')
          // initialiseWebsocket(userData);
        }
        */
      }
      else{
        dispatch({ type: 'RESTORE_USER_DATA_FAILED'});
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Web Socket Functions
  if(websocket){

    websocket.onclose = function(){
      setWebsocketInitialised(false);
      if(state.signedIn){
        console.log('websocket connection has been closed.')
        console.log('attempting to reconnect...')

        setTimeout(
          () => setWebsocket(new WebSocket(Settings.ws_siteURL + 'messenger/')),
          2000
        );
      }
    }

    websocket.onopen = function(e){
      console.log('websocket connection now open.')
      // only should really be run after the web socket is disconnected
      // and reconnected. These functions will get called in the useEffect
      // when the app starts up
      if(state.userData && !websocketInitialised){
        console.log('web init called from *socket open*')
        initialiseWebsocket(state.userData);
        syncChats(state.userData, chats, setChats);
        sortChats(chats, setChats);
      }
    }

    websocket.onmessage = function(e){
      let recieved = JSON.parse(e.data)
      const name = state.userData.first_name + ' ' + state.userData.last_name;

      if(!recieved.data || !recieved.data.action)
        return;

      if(recieved.data.action === 'NEW_CHAT_MESSAGE'){
        addNewChatMessage(chats, setChats, state.userData, recieved.data);
        sortChats(chats, setChats);
      }
      else if(recieved.data.action === 'NEW_CHAT'){
        subscribeToNewChatOnServer(state.userData, websocket, chats, setChats);
      }
      else if(recieved.data.action === 'SET_CHAT_READ'){
        let chat_id = recieved.data.chat_id;
        if(chat_id){
          let chat = findChat(chats, chat_id);
          if(chat) {
            chat.read = true;
            let newChats = [];
            Object.assign(newChats, chats);
            setChats(newChats);
            storeChats(newChats);
          }
        }
      }

    }
  }

  React.useEffect(() => {
    initialiseApp();
  }, []);


  const authContext = React.useMemo(
    () => ({
      setUserData: async userData => {
        dispatch({ type: 'SIGN_IN', userData: userData });
        state.userData = null; // <-- cos react native is shit
        initialiseApp();
      },
      updateUserData: async userData => {
        dispatch({ type: 'UPDATE_USER_DATA', userData: userData });
      },
      signOut: () => {

        setWebsocketInitialised(false);
        removeUserData();
        removeChats();
        Storage.remove('user_posts');
        Storage.remove('posts');
        setChats([]);
        dispatch({ type: 'SIGN_OUT' })

      },
      getUserData: () => { return state.userData }
      // updateChat: (chat) => {setChat(chat)}
    }),
    []
  );

  const { signOut } = authContext;
  signOutHook = signOut;

  if (state.isLoading) {
    return (

      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            width={Dimensions.get('window').width*0.9}
            source={require('../assets/images/DC-logo.png')}/>
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
          <Drawer.Navigator initialRouteName={initialRoute}
            drawerStyle={{ width: '75%', backgroundColor: ''}}
            drawerContent={props => <DrawerContent chats={chats} userData={state.userData} {...props}/>}>

            <Drawer.Screen name="TimeTable">
              {props => <TimeTableStack chats={chats} userData={state.userData} {...props}/>}
            </Drawer.Screen>

            <Drawer.Screen name="Feed">
              {props => <FeedStack chats={chats} userData={state.userData} {...props}/>}
            </Drawer.Screen>

            <Drawer.Screen name="Messenger">
              {props => <MessengerStack chats={chats} userData={state.userData} websocket={websocket} {...props}/>}
            </Drawer.Screen>

            <Drawer.Screen name="Videos">
              {props => <PastStreamStack userData={state.userData}  chats={chats} {...props}/>}
            </Drawer.Screen>

            <Drawer.Screen name="LiveStreams">
              {props => <LiveStreamStack chats={chats} userData={state.userData} {...props}/>}
            </Drawer.Screen>

            <Drawer.Screen name="Settings">
              {props => <SettingsStack chats={chats} {...props}/>}
            </Drawer.Screen>
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
