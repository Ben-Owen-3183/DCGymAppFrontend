import React, {useState} from 'react';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import {Icon, Badge, Avatar} from 'react-native-elements';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {AuthContext} from '../routes/drawer';
import CustomAvatar from './customAvatar';
import {retrieveUserData} from '../shared/storage';
import {GlobalColors} from '../styles/dcstyles';
import {BoxShadow} from 'react-native-shadow';
import messaging from '@react-native-firebase/messaging';

const fontSize = 16;
const computeitIconSmall = '../assets/images/cit_logo_simple.png';

export function DefaultDrawerContent(props) {
  return (
    <View
      style={[styles.drawer, {paddingTop: 24, maxHeight: 160, minHeight: 160}]}>
      <TouchableHighlight
        underlayColor={'#1c1c1c'}
        onPress={() =>
          props.navigation.reset({index: 1, routes: [{name: 'Login'}]})
        }>
        <View style={styles.buttonContainer}>
          <View style={{flex: 2}}>
            <Icon
              name="login"
              type="simple-line-icon"
              solid={true}
              color="#FFC300"
            />
          </View>

          <Text style={[styles.labelStyle, {marginLeft: 15, flex: 9}]}>
            Login
          </Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        underlayColor={'#1c1c1c'}
        onPress={() => props.navigation.navigate('Gym Membership')}>
        <View style={styles.buttonContainer}>
          <View style={{flex: 2}}>
            <Icon
              name="dumbbell"
              type="material-community"
              size={25}
              color="#FFC300"
            />
          </View>

          <Text style={[styles.labelStyle, {marginLeft: 15, flex: 9}]}>
            Join The Gym
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

export function DrawerContent(props) {
  const {signOut} = React.useContext(AuthContext);
  const [settingsToggle, setSettingsToggle] = useState(false);

  React.useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      try {
        if (remoteMessage.data.type) {
          if (remoteMessage.data.type.toString() == 'message') {
            props.navigation.navigate('Messenger');
          } else if (remoteMessage.data.type.toString() == 'feed') {
            props.navigation.navigate('Feed');
          } else {
            console.log("type '" + remoteMessage.data.type + "' not valid");
          }
        } else {
          console.log('no notifcation type set');
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  function toggleSettings() {
    if (settingsToggle) {
      setSettingsToggle(false);
    } else {
      setSettingsToggle(true);
    }
  }

  function countUnreadChats() {
    let count = 0;
    for (var i = 0; i < props.chats.length; i++) {
      if (props.chats[i].read === false) {
        count++;
      }
    }
    return count;
  }

  const unreadChatsCount = countUnreadChats();

  return (
    <View style={styles.drawer}>
      <View style={styles.headerView}>
        <CustomAvatar
          lightColour={true}
          avatarURL={props.userData.avatarURL}
          size={100}
          name={`${props.userData.first_name} ${props.userData.last_name}`}
        />
        <View style={{marginTop: 15}} />
        <View style={styles.avatarText}>
          <Text style={{fontSize: fontSize, color: 'white'}} numberOfLines={2}>
            {props.userData.first_name + ' ' + props.userData.last_name}
          </Text>
        </View>
        <View style={styles.avatarText}>
          <Text style={{fontSize: fontSize, color: 'white'}} numberOfLines={1}>
            {props.userData.email}
          </Text>
        </View>
      </View>
      <View style={{marginBottom: 20, marginLeft: 20}} />
      <View style={styles.line} />
      <DrawerContentScrollView {...props}>
        <View>
          <View style={{marginTop: 10}}>
            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Feed')}>
              <View style={styles.buttonContainer}>
                <View style={{flex: 2}}>
                  <Icon
                    name="users"
                    type="font-awesome-5"
                    solid={true}
                    color="#FFC300"
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Feed
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('LiveStreams')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon name="video" type="font-awesome-5" color="#FFC300" />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Live Streams
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Messenger')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name="comments"
                    solid={true}
                    type="font-awesome-5"
                    color="#FFC300"
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 25,
                    flex: 7,
                  }}>
                  <Text style={styles.labelStyle}>Messenger</Text>
                  {unreadChatsCount > 0 ? (
                    <Badge
                      status="primary"
                      containerStyle={{marginLeft: 10}}
                      badgeStyle={{borderWidth: 0}}
                      value={unreadChatsCount}
                    />
                  ) : null}
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Membership')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name="dumbbell"
                    type="material-community"
                    color="#FFC300"
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Membership
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('TimeTable')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name="calendar-day"
                    type="font-awesome-5"
                    color="#FFC300"
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Time Table
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Videos')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name="play"
                    size={20}
                    type="font-awesome-5"
                    color="#FFC300"
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Videos
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => toggleSettings()}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon name="cog" type="font-awesome-5" color="#FFC300" />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Settings
                </Text>
              </View>
            </TouchableHighlight>

            {settingsToggle ? (
              <View style={{marginLeft: 56}}>
                <View style={styles.subLine} />

                <TouchableHighlight
                  underlayColor={'#1c1c1c'}
                  onPress={() => {
                    setSettingsToggle();
                    props.navigation.navigate('Settings', {
                      screen: 'ChangePassword',
                    });
                  }}>
                  <View style={styles.buttonContainer}>
                    <Text
                      style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                      Change Password
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={'#1c1c1c'}
                  onPress={() => {
                    setSettingsToggle();
                    props.navigation.navigate('Settings', {
                      screen: 'SetAvatar',
                    });
                  }}>
                  <View style={[styles.buttonContainer]}>
                    <Text
                      style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                      Set Avatar
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={'#1c1c1c'}
                  onPress={() => {
                    setSettingsToggle();
                    props.navigation.navigate('Settings', {
                      screen: 'ResetCache',
                    });
                  }}>
                  <View style={[styles.buttonContainer]}>
                    <Text
                      style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                      Reset Cache
                    </Text>
                  </View>
                </TouchableHighlight>

                <View style={styles.subLine} />
              </View>
            ) : null}
            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => {
                props.navigation.navigate('Settings', {screen: 'Computeit'});
              }}>
              <View style={[styles.buttonContainer]}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Avatar
                    imageProps={{transitionDuration: 0}}
                    source={require(computeitIconSmall)}
                    size={33}
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Compute it
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={{backgroundColor: GlobalColors.DCGrey}}>
        <View style={styles.line} />
        <DrawerItem
          icon={() => (
            <Icon name="logout" type="simple-line-icon" color="#FFC300" />
          )}
          label="Sign Out"
          labelStyle={{color: '#FFC300', fontSize: fontSize}}
          onPress={() => {
            props.navigation.closeDrawer();
            signOut();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  drawer: {
    overflow: 'hidden',
    flex: 1,
    borderWidth: 1,
    borderColor: '#755400',
    //borderColor: '#FFC300',
    borderRadius: 20,
    backgroundColor: '#2D2D2D',
    marginLeft: 5,
    marginVertical: 20,
  },
  text: {
    color: '#FFC300',
    fontSize: 20,
  },
  headerView: {
    marginTop: 30,
    marginHorizontal: 35,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  avatarText: {
    marginTop: 5,
  },
  line: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#494949',
  },
  subLine: {
    marginLeft: 30,
    marginRight: 60,
    marginTop: 2,
    borderBottomWidth: 1,
    borderColor: '#494949',
  },
  labelStyle: {
    fontSize: fontSize,
    color: '#FFC300',
    //marginVertical: -5
  },
  sublabelStyle: {
    fontSize: fontSize,
    color: '#FFC300',
    marginLeft: 15,
    marginVertical: -5,
  },
});
