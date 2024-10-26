import React from 'react';
import {Avatar} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import Settings from '../shared/settings';
import {GlobalColors} from '../styles/dcstyles';

function getInitials(name){
  if(!name) return '?'
  return name.split(" ")[0].split("")[0] + name.split(" ")[1].split("")[0];
}

const CustomAvatar = ({name, style, size, avatarURL, lightColour}) => {

  let source = null;
  if(avatarURL){
      source = {
        uri: Settings.siteUrl + '/media/avatars/' + avatarURL,
      }
  }

  return (
    <Avatar
      imageProps={{transitionDuration: 0}}
      source={source}
      rounded
      size={(size ? size : 38)}
      icon={{name: 'user', type: 'font-awesome'}}
      title={getInitials(name)}
      containerStyle={[{
        backgroundColor : lightColour ? GlobalColors.dcLightGrey : GlobalColors.dcGrey,
      }, style]}/>
  );
}

export default CustomAvatar;
