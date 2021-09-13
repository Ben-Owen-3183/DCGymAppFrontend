import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon, Badge } from 'react-native-elements'
import HeaderRight from '../shared/headerRight';

// Screens
import Header from '../shared/header';
import Messenger from '../screens/messenger';
import Chat from '../screens/chat';
import SearchUser from '../screens/searchUser';
import ListStaff from '../screens/listStaff';

const Stack = createStackNavigator();

export default function MessengerStack({userData, websocket, chats, route, navigation }) {

  const openMenu = () => {
    Keyboard.dismiss();
    navigation.openDrawer();
  }

  function countUnreadChats(){
    let count = 0;
    for (var i = 0; i < chats.length; i++)
      if(chats[i].read === false)
        count++;
    return count;
  }

  let unreadChatsCount = 0;
  if(chats) unreadChatsCount = countUnreadChats();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          paddingTop: 7,
          fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
          fontSize : 29,
          letterSpacing : 1.5,
        },
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0},
      }}>

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>
        }}
        name="Messenger">
          {props => <Messenger navigation={navigation} chats={chats} {...props}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>
        }}
        name="SearchUser">
        {props => <SearchUser navigation={navigation} chats={chats} websocket={websocket} userData={userData} {...props}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{
          headerRight: (props) => <HeaderRight chats={chats} userData={userData} navigation={navigation} {...props}/>
        }}
        name="ListStaff">
        {props => <ListStaff websocket={websocket} userData={userData} navigation={navigation} {...props}/>}
      </Stack.Screen>


      <Stack.Screen
        name="Chat"
        options={
          ({ route, props }) => ({
            headerTitleStyle: {
              fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
              fontSize : 29,
              letterSpacing : 1.5,
            },
            headerBackTitleVisible: false,
            title: route.params.title,
            headerRight: (props) => (
              <View style={{flexDirection: 'row', marginRight: 15}}>
                {
                  unreadChatsCount > 0 ? (
                    <TouchableOpacity onPress={() => navigation.navigate('Messenger')} style={{padding : 10}}>
                      <Icon
                        name='bell'
                        type='simple-line-icon'
                        iconStyle={styles.icon}
                        size={25}
                      />
                      <Badge
                        status="primary"
                        containerStyle={{position: 'absolute', top: 2, right: 22 }}
                        badgeStyle={{borderWidth: 0}}
                        value={unreadChatsCount}
                      />
                    </TouchableOpacity>
                  ) : (null)
                }
                <View style={styles.iconView}>
                  <TouchableOpacity onPress={openMenu} style={{padding : 10}}>
                    <Icon
                      name='menu'
                      type='simple-line-icon'
                      iconStyle={styles.icon}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>

            )
          })
        }>
          {props => <Chat userData={userData} navigation={navigation} chats={chats} websocket={websocket} {...props}/>}
      </Stack.Screen>

    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  headerText : {
    fontSize : 27,
    letterSpacing : 1,
    color : '#FFC300',
    fontFamily: 'BebasNeue',
    fontWeight: 'bold',
  },
  icon : {
    color : '#FFC300',
  },
  iconView : {
    flexDirection : 'row',
    justifyContent : 'flex-end',
  },
});
