import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements'

// Screens
import Header from '../shared/header';
import Messenger from '../screens/messenger';
import Chat from '../screens/chat';
import SearchUser from '../screens/searchUser';

const Stack = createStackNavigator();

export default function MessengerStack({userData, websocket, chats, route, navigation }) {

  const openMenu = () => {
    Keyboard.dismiss();
    navigation.openDrawer();
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0},
        headerTitleStyle: styles.headerText
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='Messenger'/>
        }}
        name="Messenger">
          {props => <Messenger navigation={navigation} chats={chats} {...props}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{
          headerTitle: () => <Header navigation={navigation} title='User Search'/>
        }}
        name="SearchUser">
        {props => <SearchUser navigation={navigation} chats={chats} websocket={websocket} {...props}/>}
      </Stack.Screen>


      <Stack.Screen
        name="Chat"
        options={

          ({ route, props }) => ({
            title: route.params.title,
            headerRight: (props) => (
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
    fontFamily : 'BebasNeue Bold'
  },
  icon : {
    color : '#FFC300',
  },
  iconView : {
    flexDirection : 'row',
    justifyContent : 'flex-end',
  },
});
