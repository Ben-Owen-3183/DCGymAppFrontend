import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import {UsersName, LoadingView, PrimaryButton} from '../shared/basicComponents';
import {GlobalColors} from '../styles/dcstyles';
import Settings from '../shared/settings';
import CustomAvatar from '../shared/customAvatar';
import Storage from '../shared/storage';
import {AuthContext} from '../routes/drawer';

const backgroundImagePath = '../assets/images/timetable-background.png';
let signOutHook;

const ListStaff = ({userData, navigation, websocket}) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;

  const [staffList, setStaffList] = React.useState(null);
  const [isLoadingStaff, setIsLoadingStaff] = React.useState(false);
  const [isLoadingChat, setIsLoadingChat] = React.useState(false);
  const [failedToLoadStaff, setFailedToLoadStaff] = React.useState(false);

  async function fetchStorageStaffData(){
    try{
      const data = await Storage.get('staff_data');
      if(data) {
        setStaffList(data);
        setIsLoadingStaff(false);
      }

    } catch(e) {
      console.log(`Get Cached Staff Data: ${e}`);
    }
  }

  async function fetchStaffData(){
    if(isLoadingStaff) return;
    setIsLoadingStaff(true);

    try{
      await fetchStorageStaffData();

      let response = await fetch(Settings.siteUrl + '/user/list_staff/', {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Token " + userData.token
        },
      });

      if(response.status == 401 || response.status == 403){
        signOutHook();
        return;
      }

      let data = await response.json();

      if(data['staff_list']){
        Storage.set('staff_data', data['staff_list']);
        setStaffList(data['staff_list']);
      }
      else{
        throw 'no staff data was returned from the server';
      }
    }catch(e){
      setFailedToLoadStaff(true);
    }
    setIsLoadingStaff(false);
  }

  async function submit(user_id, name){
    if(isLoadingChat)
      return;
    setIsLoadingChat(true);

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

      if(response.status == 401 || response.status == 403){
        signOutHook();
        return;
      }

      let data = await response.json();

      if(!data['chat_id'])
        throw 'listStaff: no chat data returned from server';

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
      setIsLoadingChat(false);
      alert('Could not start chat. Make sure you are connected to the internet');
    }
    setIsLoadingChat(false);
  }

  if(!staffList && !failedToLoadStaff){
    fetchStaffData()
  }

  if(isLoadingStaff || isLoadingChat){
    return(
      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <LoadingView
          useBackground={false}
          text={isLoadingStaff ? 'Fetching staff' : 'Loading new chat'}/>
      </ImageBackground>
    )
  }

  if(!isLoadingStaff && !staffList && failedToLoadStaff){
    return(
      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 1}}></View>
          <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 5}}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 25, marginTop: 30, marginBottom: 20, textAlign: 'center', color: '#FFC300'}} >
                Fetching the staff list failed. Make sure you are connected to internet and try again
              </Text>
              <View style={{flexDirection: 'row', marginHorizontal: 80}}>
                <PrimaryButton
                  text={'       refresh       '}
                  onPress={() => {
                    setFailedToLoadStaff(false);
                  }}/>
              </View>
            </View>
            <View style={{flex: 1}}></View>
          </View>
          <View style={{flex: 1}}></View>
        </View>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <ScrollView
          style={{
            paddingTop: 50,
          }}
          keyboardShouldPersistTaps={'handled'} >
          <View style={{marginHorizontal: 40}}>
            <Text style={{
                color: GlobalColors.dcYellow,
                fontSize: 50,
                fontFamily : 'BebasNeue',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {'Staff'}
            </Text>
            <View style={{marginVertical: 10}}></View>
            <ListView staffList={staffList} submit={submit}/>
            <View style={{marginVertical: 100}}></View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const ListView = ({staffList, submit}) => {

  return staffList.map((staff, i) => {
    return (
      <TouchableHighlight
        style={{paddingHorizontal: 15, borderRadius: 100}}
        underlayColor={'#00000050'}
        onPress={() => submit(staff.id, `${staff.fName} ${staff.sName}`)}
        key={staff.id}>
        <Staff staff={staff} filled={i % 2 === 0}/>
      </TouchableHighlight>
    )
  })
}

const Staff = ({staff, filled}) => {
  const [avatarViewWidth, setAvatarViewWidth] = React.useState(null);

  function onLayout(width){
    if(avatarViewWidth) return;
    setAvatarViewWidth(width);
  }

  return (
    <View style={styles.userView}>
      <View
        onLayout={layout => onLayout(layout.nativeEvent.layout.width)}
        style={{
          marginVertical: -2,
          marginLeft: -2,
          borderWidth: 2,
          borderColor: GlobalColors.dcYellow,
          borderRadius: 100,
        }}>
        <CustomAvatar
          size={55}
          avatarURL={staff.avatarURL}
          name={`${staff.fName} ${staff.sName}`}
        />
      </View>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        right: avatarViewWidth/3,
      }}>
        <UsersName
          style={{textAlign: 'center', letterSpacing: 0, color: staff.isSuperUser ? GlobalColors.dcYellow : 'white'}}
          isStaff={staff.isStaff}
          isSuperUser={staff.isSuperUser}
          fName={staff.fName}
          sName={staff.sName}
          fontSize={25}
        />
      </View>
    </View>
  );
}

export default ListStaff;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  userView: {
    flexDirection: 'row',
    marginVertical: 9,
    alignItems: 'center',
    borderColor: GlobalColors.dcYellow,
    borderWidth: 2,
    borderRadius: 1000,
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  }
});
