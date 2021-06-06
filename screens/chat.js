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

var youToggle = null;

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

const Chat = ({route, websocket, userData, chatsData}) => {
  const [initialScroll, setInitialScroll] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [chats, setChats] = React.useState(chatsData);
  const scrollViewRef = useRef(null);
  const chat = findChat(chats, route.params.chat_id);

  async function setChatToRead(){
    try{
      let response = await fetch(Settings.siteUrl + '/messenger/set_chat_read/', {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Token " + userData.token
          },
          body: JSON.stringify({
            'chat_id': chat.id
          })
      });
      chat.read = true;
    }catch(e){
      console.log(e);
    }
  }

  async function fetchNextPage(){
    console.log("do not call this unless there is more than 29 messages")
  }

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

  const onScrollEndReached = () => {
    console.log('scrolled to end');
  }

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

  /*
  const [t, st] = React.useState(false);
  function test(){
    if(!websocket || !userData)
      return;

    if(websocket.readyState !== WebSocket.OPEN)
      return;
    st(true);
    for(let i = 0; i < 120; i++){
      websocket.send(JSON.stringify({
        'action': 'message',
        'data' : {
          'token': userData.token,
          'chat_id': route.params.chat_id,
          'message': i.toString(),
        }
      }))
    }
  }

  React.useEffect(() => {
    if(!t){
      test();
    }
  })
  */

  return (
    <View style={styles.messagesView}>
      <View style={{flex: 1}}>
        {
          chat && chat.messages.length > 0 && userData ? (
            <View style={{flex: 1}}>
              <FlatList
                inverted
                onEndReached={onScrollEndReached}
                onEndReachedThreshold={0.5}
                ref={scrollViewRef}
                data={chat.messages}
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
