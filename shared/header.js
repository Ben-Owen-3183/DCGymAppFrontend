import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon, Badge } from 'react-native-elements'

export default function Header({chats, route, dynamicTitle, navigation, title, back }) {

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
    <View style={styles.header}>
      <View style={styles.headerTextView}>
        <Text numberOfLines={1} style={styles.headerText}>{title}</Text>
      </View>

      <View style={styles.emptyElement}></View>
      <View style={styles.iconView}>
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
  );
}

const styles = StyleSheet.create({
  header : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    height : 56,
  },
  headerText : {
    fontSize : 29,
    letterSpacing : 1.5,
    color : '#FFC300',
    fontFamily : 'BebasNeue',
    fontWeight: 'bold'
  },
  icon : {
    color : '#FFC300',
  },
  headerTextView : {
  },
  iconView : {
    flexDirection : 'row',
    justifyContent : 'flex-end',
  },
  emptyElement : {
    flex: 1,
  }
});
