import {createStackNavigator} from '@react-navigation/stack';
import LiveStream from '../screens/liveStream';
import LiveStreams from '../screens/liveStreams';
import React from 'react';
import Header from '../shared/header';
import HeaderRight from '../shared/headerRight';
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Icon, Badge} from 'react-native-elements';

const Stack = createStackNavigator();

export default function LiveStreamStack({chats, navigation, userData}) {
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
        headerShown: showHeader,
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
        name="Live Streams">
        {props => (
          <LiveStreams userData={userData} navigation={navigation} {...props} />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="LiveStream"
        options={({route, props}) => ({
          title: route.params.title,
          headerBackTitleVisible: false,
          headerRight: props => {
            if (!showHeader) {
              return null;
            }
            return (
              <View style={{flexDirection: 'row', marginRight: 15}}>
                {unreadChatsCount > 0 ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Messenger')}
                    style={{padding: 10}}>
                    <Icon
                      name="bell"
                      type="simple-line-icon"
                      iconStyle={styles.icon}
                      size={25}
                    />
                    <Badge
                      status="primary"
                      containerStyle={{position: 'absolute', top: 2, right: 22}}
                      badgeStyle={{borderWidth: 0}}
                      value={unreadChatsCount}
                    />
                  </TouchableOpacity>
                ) : null}
                <View style={styles.iconView}>
                  <TouchableOpacity onPress={openMenu} style={{padding: 10}}>
                    <Icon
                      name="menu"
                      type="simple-line-icon"
                      iconStyle={styles.icon}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          },
        })}>
        {props => (
          <LiveStream
            setShowHeader={setShowHeader}
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
