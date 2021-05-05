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

const backgroundImagePath = '../assets/images/timetable-background.png';
const VerifyEmail = ({ navigation }) => {


  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>


        <View style={{flex: 1}}></View>

        <View style={{flex: 5}}>

          <View style={{alignItems: 'center' }}>
            <Text style={styles.text}>
              We have sent you an verification email.
            </Text>

            <Text style={styles.text}>
            {'\n'} If you do not see the email make sure you check your spam/junk folder.
            </Text>
          </View>

          <View style={{marginVertical: 20}}></View>

          <TouchableHighlight
            onPress={() => navigation.reset({index: 0, routes: [{ name: 'Login' }],})}
            style={styles.button}>
            <Text style={[styles.text, {color: '#FFC300', fontWeight: 'bold'}]}> Continue to Login </Text>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}
export default VerifyEmail;


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
