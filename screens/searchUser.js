import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {SearchInput, UsersName, LoadingView} from '../shared/basicComponents';
import {GlobalColors} from '../styles/dcstyles';
import Settings from '../shared/settings';
import CustomAvatar from '../shared/customAvatar';
import {retrieveUserData} from '../shared/storage';

const SearchUser = ({userData, websocket, navigation}) => {
  const [searchText, setSearchText] = React.useState('');
  const [userList, setUserList] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  // const [userData, setUserData] = React.useState('');



  async function submit(user_id, name){
    if(isLoading)
      return;
    setIsLoading(true);

    try{
      let response = await fetch(
        Settings.siteUrl + '/messenger/create_new_chat/', {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Token " + userData.token
          },
          body: JSON.stringify({ 'otherUser': user_id })
      });

      let data = await response.json();

      if(!data['chat_id'])
        throw 'Search user: no chat data returned from server';

      websocket.send(JSON.stringify({
        'action': 'new_chat',
        'data' : {
          'token': userData.token,
          'other_user_id': user_id,
          'chat_id': data['chat_id']
        }
      }));

      navigation.navigate('Chat', {
        title:  name,
        user_id: user_id,
        chat_id: data['chat_id']
      });


    }catch(e){
      console.log(e);
      setIsLoading(false);
    }
    setIsLoading(false);
  }


  function textChange(value){

    if(value === '' || !value){
      setSearchText('');
      setUserList(null);
      return;
    }

    const onSuccess = (response) => {
      setUserList(response);
    };

    const onFailure = (response) => {
      console.log('failed')
    };

    fetch(Settings.siteUrl + '/user/search/', {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Token " + userData.token
        },
        body: JSON.stringify({'text': value})
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})

    setSearchText(value);
  }

  if(isLoading){
    return(
      <LoadingView useBackground={true} text={'Loading new chat'}/>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <SearchInput
        value={searchText}
        placeholder={'Search for member'}
        onChangeText={textChange}
      />
      <ScrollView>
        {
          userList ?
          ( <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}></View>
              <View style={{flex: 30}}>
                <ListUsers userList={userList} submit={submit}/>
              </View>
              <View style={{flex: 1}}></View>
            </View>
          ) : (
            null
          )
        }
      </ScrollView>
    </View>
  );
}

const ListUsers = ({userList, submit}) => {

  if(!userList) return null;
  console.log(userList);

  return userList.map((user, i) => {
    return (
      <TouchableHighlight
        style={{marginHorizontal: 20, paddingHorizontal: 10, borderRadius: 100}}
        underlayColor={'#00000050'}
        onPress={() => submit(user.id, `${user.fName} ${user.sName}`)}
        key={user.id}>
        <User user={user}/>
      </TouchableHighlight>
    );
  })
}

const User = ({user}) => {

  return (
    <View style={styles.userView}>
      <View style={{marginRight: 20}}>
        <CustomAvatar
          size={50}
          avatarURL={user.avatarURL}
          name={`${user.fName} ${user.sName}`}
        />
      </View>
      <View>
        <UsersName
          isStaff={user.isStaff}
          isSuperUser={user.isSuperUser}
          fName={user.fName}
          sName={user.sName}
        />
      </View>
    </View>
  );
}

export default SearchUser;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: GlobalColors.dcGrey
  },
  userView: {
    flexDirection: 'row',
    marginVertical: 8,
    flex: 1,
    alignItems: 'center',
  }
});
