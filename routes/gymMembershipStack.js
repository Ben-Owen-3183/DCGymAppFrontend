import {createStackNavigator} from '@react-navigation/stack';
import GymMembership from '../screens/gymMembership';
import React from 'react';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';
import {Keyboard, Platform, StyleSheet} from 'react-native';

const Stack = createStackNavigator();

export default function GymMembershipStack({chats, navigation, userData}) {
  const [showHeader, setShowHeader] = React.useState(true);

  const openMenu = () => {
    Keyboard.dismiss();
    navigation.openDrawer();
  };

  function countUnreadChats() {
    let count = 0;
    for (let i = 0; i < chats.length; i++) {
      if (chats[i].read === false) {
        count++;
      }
    }
    return count;
  }

  let unreadChatsCount = 0;
  if (chats) {
    unreadChatsCount = countUnreadChats();
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          paddingTop: Platform.OS === 'android' ? 0 : 7,
          fontFamily:
            Platform.OS === 'android' ? 'BebasNeue Bold' : 'BebasNeue',
          fontSize: 29,
          letterSpacing: 1.5,
        },
        headerTintColor: '#FFC300',
        headerStyle: {
          backgroundColor: '#494949',
          shadowOpacity: 0,
          elevation: 0,
        },
      }}>
      <Stack.Screen
        options={{
          headerRight: props => (
            <HeaderRight
              chats={chats}
              userData={userData}
              navigation={navigation}
              {...props}
            />
          ),
        }}
        name="Gym Membership">
        {props => (
          <GymMembership
            userData={userData}
            navigation={navigation}
            {...props}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerText: {
    paddingTop: Platform.OS === 'android' ? 0 : 7,
    fontSize: 27,
    letterSpacing: 1,
    color: '#FFC300',
    fontFamily: 'BebasNeue',
    fontWeight: 'bold',
  },
  icon: {
    color: '#FFC300',
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
