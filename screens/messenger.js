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
import {PrimaryButtonWithIcon, PrimaryButton} from '../shared/basicComponents';
import {AuthContext} from '../routes/drawer';
import {UsersName} from '../shared/basicComponents';
import {retrieveChats} from '../shared/storage';
import moment from 'moment'
import Moment from 'react-moment';


const Messenger = (props) => {

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={{flex: 1, marginHorizontal: 10, marginTop: 4, flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <PrimaryButtonWithIcon
            onPress={() => props.navigation.navigate('SearchUser')}
            text="Find Member"
            iconType={'font-awesome-5'}
            iconName={'search'}/>
        </View>
        <View style={{marginHorizontal: 5}}></View>
        <View style={{flex: 2}}>
          <PrimaryButton
            onPress={() => props.navigation.navigate('ListStaff')}
            text="List Staff"/>
        </View>
      </View>
      {
        props.chats && props.chats.length > 0 ?
        (
          <Chats chats={props.chats} navigation={props.navigation}/>
        ) : (
          <View style={{flexDirection: 'row',marginTop: 40 ,flex: 1}}>
            <View style={{flex: 1}}></View>
            <View style={{
                alignItems: 'center',
                marginTop: 20,
                flex: 4,
                paddingHorizontal: 30,
                paddingVertical: 20,
                backgroundColor: GlobalColors.dcLightGrey,
                borderRadius: 30
              }}>
              <Text style={styles.text}>You are currently not chatting with anyone</Text>
              <View style={{margin: 15}}></View>
              <Text style={styles.text}>Press <Text style={styles.primaryText}>Find Member</Text> to find a gym member to chat with</Text>
              <Text style={[styles.primaryText, {marginVertical: 8}]}>OR</Text>
              <Text style={styles.text}>Press <Text style={styles.primaryText}>List Staff</Text> to see all active members of staff</Text>
            </View>
            <View style={{flex: 1}}></View>
          </View>
        )
      }

    </ScrollView>
  );
}

const Chats = ({chats, navigation}) => {

  return chats.map((chat, i) => {
    const name = `${chat.other_user_data.fName} ${chat.other_user_data.sName}`;
    const isYou = chat.messages[0].user_id.toString()
                  !== chat.other_user_data.id.toString();
    let datetimeText = moment(chat.messages[0].datetime).fromNow();
    // moment keeps printing 'in a few seconds' when it should be 'a few seconds ago'.
    if(datetimeText === 'in a few seconds')
      datetimeText = 'a few seconds ago';

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
                  {chat.messages[0].message}
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
              {datetimeText}
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
    backgroundColor : '#2D2D2D',
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  primaryText:{
    color: GlobalColors.dcYellow,
    fontWeight: 'bold',
    fontSize: 18,
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
