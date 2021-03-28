import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements'

export default function Header({ navigation, title }) {

  const openMenu = () => {
    navigation.openDrawer();
  }

  return (
    <View>

    <View style={styles.header}>

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

      <View style={styles.headerTextView}>
        <Text style={styles.headerText}> {title ? title : 'Default Title'} </Text>
      </View >

      <View style={styles.emptyElement}>

      </View>

    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header : {
    flex : 1,
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    //height : 60,
  },
  headerText : {
    fontWeight : 'bold',
    fontSize : 20,
    letterSpacing : 1,
    color : '#FFC300',
  },
  icon : {
    color : '#FFC300',
  },
  headerTextView : {
  },
  iconView : {
    flex: 1,
    flexDirection : 'row',
    justifyContent : 'flex-start',
    marginRight : 'auto'
  },
  emptyElement : {
    flex: 1,
    marginLeft : 'auto'
  }
});
