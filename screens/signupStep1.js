import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';

const backgroundImagePath = '../assets/images/timetable-background.png';
const SignupStep1 = ({ navigation }) => {

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>


        <View style={{flex: 1}}></View>

        <View style={{flex: 5}}>

          <View style={{alignItems: 'center' }}>
            <Text style={[styles.text]}>
            Are you an existing member of the David Corfield Gymnasium?
            </Text>
          </View>

          <View style={{marginVertical: 20}}></View>
          <TouchableHighlight
            underlayColor={'#dba400'} 
            onPress={() => navigation.navigate('SignupForm')}
            style={[styles.button, {backgroundColor: '#FFC300'}]}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Yes </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => navigation.navigate('GymMembership')}
            style={[styles.button]}>
            <Text style={[styles.text, {color: '#FFC300', fontWeight: 'bold'}]}> No </Text>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}
export default SignupStep1;


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
