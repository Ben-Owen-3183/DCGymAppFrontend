import React from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import Settings from '../shared/settings';

const CustomAvatar = ({initials, style, size, avatarURL}) => {
  let source = null;
  if(avatarURL){
      source = {
        uri: Settings.siteUrl + '/media/avatars/' + avatarURL,
        cache: 'reload'
      }
  }
  return (
    <Avatar
      imageProps={{transitionDuration: 0}}
      source={source}
      rounded
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
