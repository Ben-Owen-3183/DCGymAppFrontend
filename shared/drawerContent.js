import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {AuthContext} from '../routes/drawer';

export default function DrawerContent(props){

  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={{flex: 1, backgroundColor: '#494949'}}>
      <DrawerContentScrollView { ... props }>
        <View>

        </View>
      </DrawerContentScrollView>

      <View>
        <DrawerItem
          icon={() =>
            <Icon
              name='logout'
              type='simple-line-icon'
              color='#FFC300'
            />
          }
        label="Sign Out"
        labelStyle={{color: '#FFC300', fontSize: 18}}
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
  text: {
    color : '#FFC300',
    fontSize : 20,
  }
});
