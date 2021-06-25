import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Feed from '../screens/feed';
import NewPost from '../screens/newPost';
import UserPosts from '../screens/userPosts';
import React from 'react';
import Header from '../shared/header';

const Stack = createStackNavigator();

export default function FeedStack({ userData, chats, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#FFC300',
        headerStyle: {backgroundColor: '#494949', shadowOpacity: 0,elevation: 0}
      }}>

      <Stack.Screen
        options={{
          headerTitle: () => <Header chats={chats} navigation={navigation} title='Feed'/>
        }}
        name="Feed">
        {props => <Feed userData={userData} navigation={navigation} {...props}/>}
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

    </Stack.Navigator>
  );
}
