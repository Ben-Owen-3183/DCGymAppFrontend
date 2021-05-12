import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements'

export default function Header({ navigation, title, back }) {
  const openMenu = () => {
    Keyboard.dismiss();
    navigation.openDrawer();
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerTextView}>
        <Text numberOfLines={1} style={styles.headerText}> {title} </Text>
      </View>

      <View style={styles.emptyElement}></View>
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
    fontSize : 27,
    letterSpacing : 1,
    color : '#FFC300',
    fontFamily : 'BebasNeue Bold'
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
