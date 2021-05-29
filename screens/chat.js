import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput
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

const Chat = (props) => {
  const [message, setMessage] = React.useState('');
  const [userData, setUserData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollViewRef = useRef(null);

  const chat = findChat(props.chats, props.route.params.chat_id);

  function setChatToRead(){
    if(!props.userData)
      return

    const onSuccess = (response) => {
      console.log('chat set to read');
      chat.read = true;
      // updateChats(props.chats);
    };

    const onFailure = (response) => {
        console.log('failed to set chat read');
    };

    fetch(Settings.siteUrl + '/messenger/set_chat_read/', {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Token " + props.userData.token
        },
        body: JSON.stringify({
          'chat_id': chat.id
        })
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})
  }

  if(chat && !chat.read)
    setChatToRead();

  const sendMessage = () => {
    if(!props.websocket || !userData || !message || isLoading)
      return;

    if(props.websocket.readyState !== WebSocket.OPEN)
      return;

    setIsLoading(true);
    props.websocket.send(JSON.stringify({
      'action': 'message',
      'data' : {
        'token': userData.token,
        'chat_id': props.route.params.chat_id,
        'message': message,
      }
    }))

    setIsLoading(false);
    setMessage('');
  }

  useEffect(() =>{
    const load = async () => {
      let fetchedUserData;

      try {
        fetchedUserData = await retrieveUserData();
      } catch (e) {
      }
      if(!userData)
        setUserData(fetchedUserData);
    };

    load();
    scrollViewRef.current.scrollToEnd({animated : false});
  })

  return (
    <View style={styles.messagesView}>
      {/*forces text to bottom if only few messages on screen*/}
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollView}>

        <View style={{justifyContent: 'flex-end', flex: 1}}>
          <View style={{flex: 1}}></View>
          {
            chat && chat.messages.length > 0 && userData ? (
              <View style={{flex: 0}}>
                <Messages user_id={userData.user_id} messages={chat.messages}/>
              </View>
            ) : (
              null
            )
          }
        </View>
      </ScrollView>
      {
        chat && chat.messages.length > 0 ? (
          null
        ) : (
          <NoMessageView/>
        )
      }
      <CommentInputText
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

const Messages = ({messages, user_id}) => {

  return (
    messages.map((message, i) =>{
      const isUser = message.user_id === user_id;
      return(
        <View key={i}>
          {
            ToggleSpace(isUser) ? <View style={{marginVertical : 5}}></View> : null
          }

          <View style={[
              {flexDirection : 'row'},
              (isUser ? {justifyContent : 'flex-end'} : {justifyContent : 'flex-start'})
            ]}>

            {isUser ? <View style={{marginHorizontal : 30}}></View> : null}
            <View style={[isUser ? styles.yourMessage : styles.otherMessage, styles.messageView]}>
              <Text style={styles.text}>{message.message}</Text>
            </View>
            {!isUser ? <View style={{marginHorizontal : 30}}></View> : null}

          </View>
        </View>
    )})
  )
}

const CommentInputText = ({placeholder, message, setMessage, sendMessage}) => {
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
    justifyContent : 'flex-end'
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
