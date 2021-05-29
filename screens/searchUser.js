import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {SearchInput, UsersName} from '../shared/basicComponents';
import {GlobalColors} from '../styles/dcstyles';
import Settings from '../shared/settings';
import CustomAvatar from '../shared/customAvatar';
import {retrieveUserData} from '../shared/storage';

const SearchUser = (props, {navigation, chat_id}) => {
  const [searchText, setSearchText] = React.useState('');
  const [userList, setUserList] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userData, setUserData] = React.useState('');

  React.useEffect(() => {
    const loadUserData = async () => {
      let response;

      try {
        response = await retrieveUserData();
      } catch (e) {
      }
      setUserData(response);
    };

    loadUserData();
  }, []);

  function submit(user_id, name){

    if(isLoading)
      return;

    const onSuccess = (response) => {
      setIsLoading(false);
      if(response['chat_id']){

        props.websocket.send(JSON.stringify({
          'action': 'new_chat',
          'data' : {
            'token': userData.token,
            'other_user_id': user_id,
            'chat_id': response['chat_id']
          }
        }))

        props.navigation.navigate('Chat', {
          title:  name,
          user_id: user_id,
          chat_id: response['chat_id']
        });
      }

    };

    const onFailure = (response) => {
      setIsLoading(false);
      console.log(response);
    };

    // setIsLoading(true);

    fetch(Settings.siteUrl + '/messenger/create_new_chat/', {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Token " + userData.token
        },
        body: JSON.stringify({ 'otherUser': user_id })
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})
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

    };

    fetch(Settings.siteUrl + '/user/search/', {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({'text': value})
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})

    setSearchText(value);
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
  return userList.map((user, i) => {
    return (
      <TouchableHighlight
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
      <View style={{marginHorizontal: 20}}>
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
