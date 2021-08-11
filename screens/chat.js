import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import {globalStyles, GlobalColors} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {Icon} from 'react-native-elements';
import {retrieveUserData} from '../shared/storage';
import Settings from '../shared/settings'
import { useFocusEffect } from '@react-navigation/native';
import {AuthContext} from '../routes/drawer';

var youToggle = null;
let signOutHook;

function ToggleSpace(toggle){
  if(youToggle === toggle){
    return false;
  }
  youToggle = toggle;
  return true;
}

function findChat(chats, id){
  for (let chat of chats)
    if(chat.id.toString() === id.toString())
      return chat;
}

const Chat = ({navigation, route, websocket, userData, chats}) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const [initialScroll, setInitialScroll] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [firstScrollToEndCalled, setFirstScrollToEndCalled] = React.useState(false);
  const [chatHistory, setChatHistory] = React.useState([]);
  const scrollViewRef = useRef(null);
  const chat = findChat(chats, route.params.chat_id);

  async function setChatToRead(){
    try{
      websocket.send(JSON.stringify({
        'action': 'chat_read',
        'data' : {
          'token': userData.token,
          'chat_id': route.params.chat_id,
        }
      }))
    }catch(e){
      console.log(e);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        try{
          // ignore error. To fix error just add a condition that does not called
          // this function pressing hardware back button on android
          // or when pressing back on this chat screens header.
          navigation.popToTop();
        }
        catch(e){}
      };
    }, [])
  );

  if(chat && !chat.read)
    setChatToRead();

  const sendMessage = () => {
    if(!websocket || !userData || !message || isLoading)
      return;

    if(websocket.readyState !== WebSocket.OPEN)
      return;

    setIsLoading(true);
    try{
      websocket.send(JSON.stringify({
        'action': 'message',
        'data' : {
          'token': userData.token,
          'chat_id': route.params.chat_id,
          'message': message,
        }
      }))
    }catch(e){
      console.log(`chat WebSocket: ${e}`);
    }

    setIsLoading(false);
    setMessage('');
  }

  async function getHistory(){
    try {
      console.log("getting history");

      let payload = {}
      if(chatHistory.length === 0){
        payload.chat_id = chat.id;
        payload.last_message_time = chat.messages[chat.messages.length - 1].datetime;
        payload.last_message_id = chat.messages[chat.messages.length - 1].id;
      }
      else{
        payload.chat_id = chat.id;
        payload.last_message_time = chatHistory[chatHistory.length - 1].datetime;
        payload.last_message_id = chatHistory[chatHistory.length - 1].id;
      }

      let response = await fetch(Settings.siteUrl + '/messenger/chat_history/', {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Token " + userData.token
          },
          body: JSON.stringify(payload)
        });

      if(response.status == 401 || response.status == 403){
        signOutHook();
        return;
      }

      let data = await response.json();
      // console.log(`Chat History ${JSON.stringify(data)}`);

      if(data.messages && data.messages.length > 0)
        setChatHistory(chatHistory.concat(data.messages))
      else
        console.log('no chat history returned');
    } catch (e) {

    }
  }

  const onScrollEndReached = () => {

    console.log('scrolled to end called');
    if(!firstScrollToEndCalled){
      setFirstScrollToEndCalled(true);
      return;
    }
    if(chat.messages.length == 30)
    getHistory();
  }

  // let allMessages = chat.messages.concat(chatHistory);

  const messageComponent = ({item}) => {
    const isUser = item.user_id.toString() === userData.user_id.toString();

    return (
      <View key={item.id}>

        <View style={[
            {flexDirection : 'row'},
            (isUser ? {justifyContent : 'flex-end'} : {justifyContent : 'flex-start'})
          ]}>
            {isUser ? <View style={{marginHorizontal : 30}}></View> : null}
          <View style={[isUser ? styles.yourMessage : styles.otherMessage, styles.messageView]}>
            <Text style={styles.text}>{item.message}</Text>
          </View>
          {!isUser ? <View style={{marginHorizontal : 30}}></View> : null}
        </View>
        {
          ToggleSpace(isUser) ? <View style={{marginVertical : 5}}></View> : null
        }
    
      </View>
    )
  }

  return (
    <View style={styles.messagesView}>
      <View style={{flex: 1}}>
        {
          chat && chat.messages.length > 0 && userData ? (
            <View style={{flex: 0}}>
              <FlatList
                keyboardShouldPersistTaps={'handled'}
                inverted
                onEndReached={onScrollEndReached}
                onEndReachedThreshold={0.5}
                ref={scrollViewRef}
                data={chat.messages.concat(chatHistory)}
                keyExtractor={item => item.id}
                renderItem={messageComponent}
              />
            </View>
          ) : (
            null
          )
        }
      </View>
      {
        chat && chat.messages && chat.messages.length > 0 ? (
          null
        ) : (
          <NoMessageView/>
        )
      }
      <CommentInputText
        scrollViewRef={scrollViewRef}
        message={message}
        sendMessage={sendMessage}
        chat={chat}
        setMessage={setMessage}
        placeholder={"Write a message..."}/>
    </View>
  );
}

const NoMessageView = ({messages}) => {
  return (
    <View style={{
        marginBottom: 50,
        alignItems: 'center',
      }}>
      <Text style={{color: GlobalColors.dcYellow, fontSize: 18}}>
        No messages have been sent in this chat yet.
      </Text>
    </View>
  )
}

const CommentInputText = ({scrollViewRef, placeholder, message, setMessage, sendMessage}) => {
  if(scrollViewRef && scrollViewRef.current){
    scrollViewRef.current.scrollToIndex({
      index: 0,
      animated: false,
    });
  }

  return (
    <View style={{
      flexDirection : 'row',
      alignItems : 'flex-end'
    }}>
      <View style={styles.inputView}>
        <TextInput
          value={message}
          onChangeText={message => setMessage(message)}
          multiline={true}
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={'#afafaf'}
        />
      </View>
      <TouchableOpacity onPress={() => sendMessage()} style={styles.sendButton} >
        <Icon name='send' size={35} color='#FFC300'/>
      </TouchableOpacity>
    </View>
  )
}

export default Chat;

const styles = StyleSheet.create({
  scrollView : {
    height: '100%',
  },
  messagesView : {
    backgroundColor : '#2D2D2D',
    justifyContent : 'flex-end',
    flex: 1
  },
  sendButton : {
    flex : 0,
    paddingHorizontal : 10,
    paddingVertical : 15,
    borderRadius : 10
  },
  messageView : {
    marginVertical : 1,
    marginHorizontal : 15,
    borderTopLeftRadius : 15,
    borderTopRightRadius : 15,
    borderBottomRightRadius : 15,
    borderBottomLeftRadius : 15,
    flex : -1
  },
  yourMessage : {
    backgroundColor : '#458145',
    alignSelf : 'flex-end',
  },
  otherMessage : {
    backgroundColor : '#494949',
  },
  inputText : {
    color : 'white',
    fontSize : 16,
  },
  inputView : {
    flex : 1,
    backgroundColor : '#494949',
    borderRadius : 25,
    marginBottom : 10,
    marginTop : 0,
    marginLeft : 10,
    paddingHorizontal : 15,
  },
  text : {
    color : 'white',
    fontSize : 16,
    paddingVertical : 6,
    paddingHorizontal : 10
  },
});
