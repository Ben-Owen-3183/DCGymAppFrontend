import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import Settings from '../shared/settings'

const backgroundImagePath = '../assets/images/timetable-background.png';
const ChangePasswordSuccess = ({ navigation }) => {


  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>

        <View style={{flex: 1}}></View>
        <View style={{flex: 5}}>
          <View style={{alignItems: 'center' }}>
            <Text style={styles.text}>
              Your password has been changed.
            </Text>

          </View>

          <View style={{marginVertical: 20}}></View>

          <TouchableHighlight
            style={styles.button}
            onPress={() => navigation.reset({index: 0, routes: [{ name: Settings.homePage }],})}>
            <Text style={[styles.text, {color: '#FFC300', fontWeight: 'bold'}]}> Continue </Text>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}
export default ChangePasswordSuccess;


const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    // backgroundColor : '#2D2D2D',
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
  button : {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
});
