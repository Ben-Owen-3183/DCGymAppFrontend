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

const backgroundImagePath = '../assets/images/timetable-background.png';

const ListStaff = ({userData, navigation, websocket}) => {
  const [staffList, setStaffList] = React.useState(null);
  const [isLoadingStaff, setIsLoadingStaff] = React.useState(false);
  const [isLoadingChat, setIsLoadingChat] = React.useState(false);
  const [failedToLoadStaff, setFailedToLoadStaff] = React.useState(false);

  async function fetchStorageStaffData(){
    try{
      const data = await Storage.get('staff_data');
      if(data) {
        setStaffList(data)
      }

    } catch(e) {
      console.log(`Get Cached Staff Data: ${e}`);
      setFailedToLoadStaff(true);
    }
  }

  async function fetchStaffData(){
    if(isLoadingStaff) return;
    setIsLoadingStaff(true);

    try{
      let response = await fetch(Settings.siteUrl + '/user/list_staff/', {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Token " + userData.token
          },
        });
      let data = await response.json();

      if(data['staff_list']){
        Storage.set('staff_data', data['staff_list']);
        setStaffList(data['staff_list']);
      }
      else{
        throw 'no staff data was returned from the server';
      }
    }catch(e){
      fetchStorageStaffData();
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
        <LoadingView text={isLoadingStaff ? 'Fetching staff' : 'Loading new chat'}/>
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
                  text={'refresh'}
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
        <View style={{flex: 1}}></View>
        <View style={{flex: 5}}>
          <ScrollView>
            <Text style={{
                margin: 10,
                color: GlobalColors.dcYellow,
                fontSize: 50,
                fontFamily : 'BebasNeue Bold',
                textAlign: 'center',
              }}>
              {'Staff'}
            </Text>
            <View style={{marginVertical: 10}}></View>
            <ListView staffList={staffList} submit={submit}/>
          </ScrollView>
        </View>
        <View style={{flex: 1}}></View>
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
        <Staff staff={staff}/>
      </TouchableHighlight>
    )
  })
}

const Staff = ({staff}) => {

  return (
    <View style={styles.userView}>
      <View style={{marginRight: -40}}>
        <CustomAvatar
          size={70}
          avatarURL={staff.avatarURL}
          name={`${staff.fName} ${staff.sName}`}
        />
      </View>
      <View style={{ flex: 1}}>
        <UsersName
          style={{textAlign: 'center',}}
          isStaff={staff.isStaff}
          isSuperUser={staff.isSuperUser}
          fName={staff.fName}
          sName={staff.sName}
          fontSize={27}
        />
      </View>
    </View>
  );
}


export default ListStaff;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 50,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  userView: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
    borderColor: GlobalColors.dcYellow,
    borderWidth: 1,
    backgroundColor: GlobalColors.dcGrey,
    padding: 8,
    borderRadius: 1000
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  }
});
