import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import {globalStyles, GlobalColors} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {PrimaryButtonWithIcon} from '../shared/basicComponents';
import {AuthContext} from '../routes/drawer';
import {UsersName} from '../shared/basicComponents';
import {retrieveChats} from '../shared/storage';
import moment from 'moment'
import Moment from 'react-moment';

async function sort(chat){
  console.log("You are not sorting chats!")
  return chat;
}


const Messenger = (props) => {

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={{marginHorizontal: 5, marginTop: 4}}>
        <PrimaryButtonWithIcon
          onPress={() => props.navigation.navigate('SearchUser')}
          text="Search users to message"
          iconType={'font-awesome-5'}
          iconName={'search'}/>
      </View>
      {
        props.chats.length > 0 ?
        (
          <Chats chats={props.chats} navigation={props.navigation}/>
        ) : (
          null
        )
      }

    </ScrollView>
  );
}

const Chats = ({chats, navigation}) => {

  return chats.map((chat, i) => {
    const name = `${chat.other_user_data.fName} ${chat.other_user_data.sName}`;
    const isYou = chat.messages[chat.messages.length - 1].user_id.toString()
      !== chat.other_user_data.id.toString()

    return(
      <TouchableHighlight
        key={chat['id']}
        underlayColor={'#212121'}
        onPress={() => {
          navigation.navigate('Chat', {
            title: name,
            chat_id: chat.id
          });
        }}>
        <View style={[styles.chatRow, {backgroundColor : (!chat.read ? '#458145' : null)} ]}>
          <CustomAvatar
            name={name}
            size={55}
            avatarURL={chat.other_user_data.avatarURL} />
          <View style={{flex : 1, marginLeft : 12}}>
            <UsersName
              isStaff={chat['isStaff']}
              isSuperUser={chat['isSuperUser']}
              fName={chat['other_user_data']['fName']}
              sName={chat['other_user_data']['sName']}
            />

            <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center'}}>
              <View>
                <Text numberOfLines={1} style={[styles.subText, {fontWeight : 'bold' }]}>
                  {(isYou ? 'You: ' : name + ': ')}
                </Text>
              </View>

              <View style={{flex : 1, marginHorizontal : 5}}>
                <Text numberOfLines={1} style={styles.subText}>
                  {chat.messages[chat.messages.length - 1].message}
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
              {moment().startOf(chat.messages[chat.messages.length - 1].datetime).fromNow()}
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
