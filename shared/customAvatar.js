import React from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet} from 'react-native';

const CustomAvatar = ({initials, style, size, avatarData}) => {

  let source = null;
  if(avatarData){
      source = {uri: `data:${avatarData.type};base64,${avatarData.base64}`}
  }

  return (
    <Avatar
      source={(source ? source : null)}
      rounded
      size="medium"
      size={(size ? size : 38)}
      icon={{name: 'user', type: 'font-awesome'}}
      title={initials}
      containerStyle={[styles.avatar, style]}/>
  );
}

export default CustomAvatar;

const styles = StyleSheet.create({
  avatar : {
    backgroundColor : '#a5a5a5',
  },
})
