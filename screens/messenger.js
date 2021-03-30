import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';

var loremIpsum = require('lorem-ipsum-react-native');

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

const names = [
  'Jane Doe',
  'Joe Blogs',
  'Sarah Smith',
  'Greg Smith',
  'Will Jones',
  'Sarah Jones',
  'Alexander Montgomery'
];

const times = [
  '3h',
  '7h',
  'yesterday',
  '11 Mar',
  'Mon',
  'Fri'
];

function Chat(name, lastMessage, lastMessageTime){
  this.name = name;
  this.lastMessagePerson = RandomNumber(2) === 0;
  this.lastMessage = lastMessage;
  this.lastMessageTime = lastMessageTime;
  this.newMessage = RandomNumber(5) < 1;
}

function GenerateChats(){
  var chats = Array();
  for(var i = 0; i < 15; i++){
    chats.push(new Chat(
      names[RandomNumber(names.length)],
      GenerateMessageText(),
      times[RandomNumber(times.length)]
    ));
  }
  return chats;
}

function GetInitials(name){
  return name.split(" ")[0].split("")[0] + name.split(" ")[1].split("")[0];
}

const Messenger = ({navigation}) => {
  return (
    <ScrollView style={styles.mainContainer}>
      <Chats navigation={navigation}/>
    </ScrollView>
  );
}

const Chats = ({navigation}) => {
  return GenerateChats().map((chat, i) => {
    return(
      <TouchableHighlight key={i} underlayColor={'#212121'} onPress={() => navigation.navigate('Chat', { title :  chat.name})}>
        <View style={[styles.chatRow, {backgroundColor : (chat.newMessage ? '#458145' : null)} ]}>
          <CustomAvatar intials={GetInitials(chat.name)} size={55}/>
          <View style={{flex : 1, marginLeft : 12}}>
            <Text numberOfLines={1} style={styles.chatText}>
              {chat.name}
            </Text>

            <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center'}}>

              <View>
                <Text numberOfLines={1} style={[styles.subText, {fontWeight : 'bold' }]}>
                  {(chat.lastMessagePerson ? 'You: ' : chat.name + ': ')}
                </Text>
              </View>

              <View style={{flex : 1, marginHorizontal : 5}}>
                <Text numberOfLines={1} style={styles.subText}>
                  {chat.lastMessage}
                </Text>
              </View>

              <View>
                <Text style={[styles.subText, {fontWeight : 'bold'}]}></Text>
              </View>
            </View>
            <View style={{marginHorizontal : 10}}></View>
          </View>

          <View style={styles.time}>
            <Text style={styles.chatText}>
            {chat.lastMessageTime}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  })
}

export default Messenger;

const styles = StyleSheet.create({
  mainContainer : {
    backgroundColor : '#2D2D2D'
  },
  chatRow : {
    //justifyContent : 'space-between',
    alignItems : 'center',
    flexDirection : 'row',
    marginVertical : 3,
    marginHorizontal : 5,
    paddingLeft : 10,
    paddingVertical : 8,
    borderRadius : 50
  },
  chatText : {
    color : '#FFFFFF',
    fontSize : 16,
    fontWeight: "bold"
  },
  chatTextStaff : {
    color : '#FFC300',
    fontSize : 16,
    fontWeight: "bold"
  },
  subText : {
    color : '#afafaf',
    fontSize : 16
  },
  time : {
    marginHorizontal : 15,
    paddingHorizontal : 8,
    paddingBottom : 1,
    borderRadius : 40,
  }
});
