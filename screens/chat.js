import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {Icon} from 'react-native-elements';

var loremIpsum = require('lorem-ipsum-react-native');
var youToggle = null;

function RandomNumber(max){
  return (Math.floor(Math.random() * max));
}

function GenerateMessageText(){
  return loremIpsum({
    count : RandomNumber(3) + 1,
    units : 'sentences',
    format : 'plain',
    sentenceLowerBound: 1,
    sentenceUpperBound: 6
  })
}
const times = [
  '12:00AM',
  '7:00AM',
  'yesterday',
  '11 Mar',
  'Mon',
  'Fri'
];

function ChatObject(){
  this.you = RandomNumber(2);
  this.text = GenerateMessageText();
  this.time = times[RandomNumber(times.length)];
}

function GenerateChats(){
  var chats = Array();

  for(var i = 0; i < RandomNumber(15) + 30; i++){
    chats.push(new ChatObject());
  }

  youToggle = chats[0].you;

  return chats;
}


function ToggleSpace(toggle){
  if(youToggle === toggle){
    return false;
  }
  youToggle = toggle;
  return true;
}


const Chat = ({chatname}) => {
  const scrollViewRef = useRef(null);

  useEffect(() =>{
    scrollViewRef.current.scrollToEnd({animated : false});
  })

  return (
    <View style={styles.messagesView}>
      {/*forces text to bottom if only few messages on screen*/}
      <View style={{flex : 100}}></View>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View>
        {
          GenerateChats().map((message, i) =>{
            return(
              <View key={i}>
                {
                  ToggleSpace(message.you) ? <View style={{marginVertical : 5}}></View> : null
                }

                <View style={[
                  {flexDirection : 'row'},
                  (message.you ? {justifyContent : 'flex-end'} : {justifyContent : 'flex-start'})
                ]}>

                  {message.you ? <View style={{marginHorizontal : 30}}></View> : null}
                  <View style={[message.you ? styles.yourMessage : styles.otherMessage, styles.messageView]}>
                    <Text style={styles.text}> {message.text} </Text>
                  </View>
                  {!message.you ? <View style={{marginHorizontal : 30}}></View> : null}

                </View>
              </View>
          )})
        }
        </View>
      </ScrollView>
      <CommentInputText placeholder={"Write a message..."}/>
    </View>
  );
}

const CommentInputText = ({placeholder}) => {
  return (
    <View style={{flexDirection : 'row', alignItems : 'flex-end'}}>
      <View style={styles.inputView}>
        <TextInput
            multiline={true}
            style={styles.inputText}
            placeholder={placeholder}
            placeholderTextColor={'#afafaf'}
          />

      </View>
      <TouchableOpacity onPress={() => alert('hello')} style={styles.sendButton} >
        <Icon name='send' size={35} color='#FFC300'/>
      </TouchableOpacity>
    </View>
  )
}

export default Chat;

const styles = StyleSheet.create({
  scrollView : {
    marginHorizontal : 3,
    flex : 0
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
    //flex : 0,
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
    borderRadius : 15,
    marginBottom : 10,
    marginTop : 0,
    marginLeft : 10,
    paddingHorizontal : 15,
    //borderWidth : 0.5,
    //borderColor : '#FFC300'
  },
  text : {
    color : 'white',
    fontSize : 16,
    paddingVertical : 6,
    paddingHorizontal : 10
  },
});
