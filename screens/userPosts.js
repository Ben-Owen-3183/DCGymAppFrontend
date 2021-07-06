import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {PrimaryButton} from '../shared/basicComponents';
import Settings from '../shared/settings';
import Feed from './feed';

const UserPosts = ({userData, navigation}) => {
  return(
    <Feed userData={userData} navigation={navigation} userFeed={true}/>
  )
}

export default UserPosts;
