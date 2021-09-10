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

        <Text style={styles.titleText}>Sign up </Text>

          <View style={{alignItems: 'center' }}>
            <Text style={styles.text}><Text style={[styles.text, {color: "#FFC300"}]}></Text>
            To sign up to this app you must be an
            <Text style={[styles.text, {color: "#FFC300"}]}> existing </Text>
            member of the
            <Text style={[styles.text, {color: "#FFC300"}]}> David Corfield Gymnasium. </Text>
            {'\n\n'}
            If you are
            <Text style={[styles.text, {color: "#FFC300"}]}> not </Text>
            a gym member, select
            <Text style={[styles.text, {color: "#FFC300"}]}> Gym sign up </Text>
            and proceed to fill out the gym membership form
            ensuring you enter a valid email address, as this will be needed to sign up to the app.
            {'\n\n'}
            Once you <Text style={[styles.text, {color: "#FFC300"}]}>are a member </Text>of the gym
            return here and select
            <Text style={[styles.text, {color: "#FFC300"}]}> App sign up. </Text>
            {'\n\n'}
            </Text>
            <Text style={[styles.text]}>
            </Text>
          </View>

          <TouchableHighlight
            underlayColor={'#dba400'}
            onPress={() => navigation.navigate('SignupForm')}
            style={[styles.button, {backgroundColor: '#FFC300'}]}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> App sign up </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => navigation.navigate('Gym Membership')}
            style={[styles.button]}>
            <Text style={[styles.text, {color: '#FFC300', fontWeight: 'bold'}]}> Gym sign up </Text>
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
  titleText : {
    color : '#FFC300',
    margin : 'auto',
    marginTop : 20,
    marginBottom : 20,
    fontSize : 60,
    fontFamily: 'BebasNeue',
    fontWeight: 'bold',
  },
});
