import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ImageBackground,
  Platform,
} from 'react-native';
import CustomAvatar from '../shared/customAvatar';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../routes/drawer';
import {storeUserData, retrieveUserData} from '../shared/storage';
import Settings from '../shared/settings';
import Storage from '../shared/storage';

const backgroundImagePath = '../assets/images/timetable-background.png';


const ResetCache = ({ navigation }) => {

  function submit(){
    Storage.clearCache();
    alert(`Cache cleared. Close and repopen the app to see changes`)
  }

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>

        <View style={{flex: 1}}></View>

        <View style={{flex: 4}}>
          <View style={{alignItems: 'center' }}>
            <Text style={styles.titleText}>
              Reset Cache
            </Text>
            <View style={{marginVertical: 10}}></View>
            <Text style={styles.subTitleText}>
              Removes all locally stored data
            </Text>
            <View style={{marginVertical: 3}}></View>
          </View>

          <TouchableHighlight
            underlayColor={'#dba400'}
            onPress={() => submit()}
            style={styles.button}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Reset Cache </Text>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}

export default ResetCache;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color : 'white',
    fontSize : 20,
    textAlign: 'center'
  },
  inputText: {
    paddingVertical: 15,
  },
  inputContainer: {
    marginHorizontal: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  secondaryButton: {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
  },
  button : {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
  subTitleText : {
      color : 'white',
      textAlign: 'center',
      margin : 'auto',
      marginTop : 20,
      marginBottom : 0,
      fontSize : 20,
  },
  titleText : {
      color : '#FFC300',
      margin : 'auto',
      marginTop : 20,
      marginBottom : 20,
      fontSize : 40,
      fontWeight: Platform.OS === 'android' ? null: 'bold',
      fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
    },
});
