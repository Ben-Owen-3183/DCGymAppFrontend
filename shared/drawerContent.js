import React, {useState} from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {AuthContext} from '../routes/drawer';
import CustomAvatar from './customAvatar';
import {retrieveUserData} from '../shared/storage';

const fontSize = 16;


export function DefaultDrawerContent(props){
  return(
      <View style={[styles.drawer, {paddingTop: 24, maxHeight: 160, minHeight: 160}]}>
        <TouchableHighlight
          underlayColor={'#1c1c1c'}
          onPress={() => props.navigation.reset({index: 1, routes: [{name: 'Login'}]})}>
          <View style={styles.buttonContainer}>
            <View style={{flex: 2}}>
              <Icon
                name='login'
                type='simple-line-icon'
                solid={true}
                color='#FFC300'
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
                name='dumbbell'
                type='material-community'
                size={25}
                color='#FFC300'
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




export function DrawerContent(props){

  const { signOut } = React.useContext(AuthContext);
  const [settingsToggle, setSettingsToggle] = useState(false);

  function toggleSettings(){
    if(settingsToggle)
      setSettingsToggle(false)
    else
      setSettingsToggle(true)
  }

  return (
    <View style={styles.drawer}>
      <DrawerContentScrollView { ... props }>
        <View>
          <View style={styles.headerView}>
            <CustomAvatar avatarURL={props.userData.avatarURL} size={100}/>
            <View style={{marginTop: 15}}></View>
            <View style={styles.avatarText}>
              <Text style={{fontSize: fontSize, color: 'white'}}
                numberOfLines={2}>
                {props.userData.first_name + ' ' + props.userData.last_name}
              </Text>
            </View>
            <View style={styles.avatarText}>
              <Text style={{fontSize: fontSize, color: 'white'}}
                numberOfLines={1}>
                {props.userData.email}
              </Text>
            </View>
          </View>
          <View style={{marginBottom: 20, marginLeft: 20}}>

          </View>

          <View style={styles.line}></View>

          <View style={{marginTop: 10}}>




            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Feed')}>
              <View style={styles.buttonContainer}>
                <View style={{flex: 2}}>
                  <Icon
                    name='users'
                    type='font-awesome-5'
                    solid={true}
                    color='#FFC300'
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Feed
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Live Stream')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name='video'
                    type='font-awesome-5'
                    color='#FFC300'
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Live Stream
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('Messenger')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name='comments'
                    solid={true}
                    type='font-awesome-5'
                    color='#FFC300'
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Messenger
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'#1c1c1c'}
              onPress={() => props.navigation.navigate('TimeTable')}>
              <View style={[styles.buttonContainer]}>
                <View style={{flex: 2}}>
                  <Icon
                    name='calendar-day'
                    type='font-awesome-5'
                    color='#FFC300'
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
                    name='play'
                    size={20}
                    type='font-awesome-5'
                    color='#FFC300'
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
                  <Icon
                    name='cog'
                    type='font-awesome-5'
                    color='#FFC300'
                  />
                </View>

                <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                  Settings
                </Text>
              </View>
            </TouchableHighlight>


            {
              settingsToggle
              ? (
                <View style={{marginLeft: 56}}>

                  <View style={styles.subLine}></View>

                  <TouchableHighlight
                    underlayColor={'#1c1c1c'}
                    onPress={() => {
                        setSettingsToggle();
                        props.navigation.navigate('Settings', { screen: 'ChangePassword' })
                      }
                    }>
                    <View style={styles.buttonContainer}>

                      <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                        Change Password
                      </Text>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight
                    underlayColor={'#1c1c1c'}
                    onPress={() => {
                        setSettingsToggle();
                        props.navigation.navigate('Settings', { screen: 'SetAvatar' })
                      }
                    }>
                    <View style={[styles.buttonContainer]}>
                      <Text style={[styles.labelStyle, {marginLeft: 25, flex: 7}]}>
                        Set Avatar
                      </Text>
                    </View>
                  </TouchableHighlight>

                  <View style={styles.subLine}></View>

                </View>
              ) : (
                null
              )
            }

          </View>
        </View>
      </DrawerContentScrollView>

      <View>
        <View style={styles.line}></View>
        <DrawerItem
          icon={() =>
            <Icon
              name='logout'
              type='simple-line-icon'
              color='#FFC300'
            />
          }
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
    color : '#FFC300',
    fontSize : 20,
  },
  headerView: {
    marginTop: 30,
    marginHorizontal: 35,
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  avatarText : {
    marginTop: 5,
  },
  line: {
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#494949'
  },
  subLine: {
    marginLeft: 30,
    marginRight: 60,
    marginTop: 2,
    borderBottomWidth: 1,
    borderColor: '#494949'
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
    marginVertical: -5
  }
});
