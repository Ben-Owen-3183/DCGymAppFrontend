import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Feed from '../screens/feed';
import NewPost from '../screens/newPost';
import UserPosts from '../screens/userPosts';
import React from 'react';
import Header from '../shared/header';
import { Icon, Badge } from 'react-native-elements'
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import VideoPlayerScreen from '../screens/videoPlayerScreen';

const Stack = createStackNavigator();

export default function FeedStack({ userData, chats, navigation }) {
  const [showHeader, setShowHeader] = React.useState(true);

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
        headerShown: showHeader,
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Feed'/>
        }}
        name="Feed">
        {props => <Feed userData={userData} navigation={navigation} userFeed={false} {...props}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Create New Post'/>
        }}
        name="NewPost">
        {props => <NewPost userData={userData} navigation={navigation} {...props}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Your Posts'/>
        }}
        name="UserPosts">
        {props => <UserPosts userData={userData} navigation={navigation} {...props}/>}
      </Stack.Screen>



      <Stack.Screen
        name="Player"
        options={
          ({ route, props }) => ({
            title: route.params.title,
            headerRight: (props) => {
              if(!showHeader) return null;
              return(
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
            }
          })
        }>
          {props => <VideoPlayerScreen setShowHeader={setShowHeader} navigation={navigation} {...props}/>}
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
