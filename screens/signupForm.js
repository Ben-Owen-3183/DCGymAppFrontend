import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  ImageBackground
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import Image from 'react-native-scalable-image';

const backgroundImagePath = '../assets/images/timetable-background.png';

const SignupForm = ({ navigation }) => {

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <ScrollView style={{width : '100%'}}>
        <View style={{padding: 14}}></View>
        <View style={{alignItems: 'center'}}>
          <Image
            width={Dimensions.get('window').width*0.9}
            source={require('../assets/images/dclogo.png')}/>
          <Text style={styles.text}></Text>
        </View>

        <View style={styles.mainContainer}>

          <View style={{flex: 1}}></View>

          <View style={{flex: 10}}>
            <Names/>
            <Email/>
            <Password/>

            <View style={{marginVertical: 20}}></View>
            <TouchableHighlight style={[styles.button, {backgroundColor: '#FFC300'}]}>
              <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Submit </Text>
            </TouchableHighlight>
          </View>

          <View style={{flex: 1}}></View>
        </View>
        <View style={{padding: 60}}></View>
      </ScrollView>
    </ImageBackground>
  );
}

const Email = () => {
  return(
    <View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.subFormHeaderContainer}>
          <Text style={[styles.headerText]}>
            Email
          </Text>
        </View>
        <View style={{flex: 1}}></View>
      </View>

      <View style={styles.subFormContainer}>
        <View style={{marginBottom: 10, marginTop: 5, marginLeft : 3 }}>
          <Text style={styles.text}>
            Please ensure the email you use is the one
            you used when intially signing up to David Corfields Gymnasium.
          </Text>
        </View>

        <TextInput
          style={styles.inputText}
          placeholder="Email"
          numberOfLines={1}
          keyboardType={'email-address'}
          placeholderTextColor={'lightgrey'}
          fontSize={18}
          color={'white'}
          keyboardAppearance={'dark'}
          textContentType={'emailAddress'}
        />
        <View style={styles.inputContainer}></View>
        <View style={{marginVertical: 8}}></View>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Email"
          numberOfLines={1}
          keyboardType={'email-address'}
          placeholderTextColor={'lightgrey'}
          fontSize={18}
          color={'white'}
          keyboardAppearance={'dark'}
          textContentType={'emailAddress'}
        />
        <View style={styles.inputContainer}></View>
      </View>
    </View>
  )
}

const Names = () => {
  return(
    <View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.subFormHeaderContainer}>
          <Text style={[styles.headerText]}>
            Name
          </Text>
        </View>
        <View style={{flex: 1}}></View>
      </View>

      <View style={styles.subFormContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="First Name"
          numberOfLines={1}
          keyboardType={'default'}
          placeholderTextColor={'lightgrey'}
          fontSize={18}
          color={'white'}
          keyboardAppearance={'dark'}
          textContentType={'name'}
        />
        <View style={styles.inputContainer}></View>
        <View style={{marginVertical: 8}}></View>
        <TextInput
          style={styles.inputText}
          placeholder="Last Name"
          numberOfLines={1}
          keyboardType={'default'}
          placeholderTextColor={'lightgrey'}
          fontSize={18}
          color={'white'}
          keyboardAppearance={'dark'}
          textContentType={'familyName'}
        />
        <View style={styles.inputContainer}></View>
      </View>
    </View>
  )
}

const Password = () => {
  return(
    <View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.subFormHeaderContainer}>
          <Text style={[styles.headerText]}>
            Password
          </Text>
        </View>
        <View style={{flex: 1}}></View>
      </View>

      <View style={styles.subFormContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          numberOfLines={1}
          keyboardType={'default'}
          placeholderTextColor={'lightgrey'}
          fontSize={18}
          color={'white'}
          keyboardAppearance={'dark'}
          textContentType={'password'}
          secureTextEntry={true}
        />
        <View style={styles.inputContainer}></View>
        <View style={{marginVertical: 8}}></View>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          numberOfLines={1}
          keyboardType={'default'}
          placeholderTextColor={'lightgrey'}
          fontSize={18}
          color={'white'}
          keyboardAppearance={'dark'}
          textContentType={'password'}
          secureTextEntry={true}
        />
        <View style={styles.inputContainer}></View>
      </View>
    </View>
  )
}

export default SignupForm;


const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor : '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color : 'white',
    fontSize : 20,
  },
  headerText: {
    color : 'lightgrey',
    fontSize : 23,
    fontWeight: 'bold',
    marginHorizontal : 8,
    // marginBottom: 24,
  },
  inputText: {
    paddingVertical: 10,
  },
  inputContainer: {
    //paddingVertical: 0,
    //backgroundColor: '#494949',
    //borderRadius: 40,
    //backgroundColor: '#ff9900',
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
  subFormContainer: {
    borderWidth : 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 15,
    borderTopLeftRadius: 0
  },
  subFormHeaderContainer: {
    marginTop : 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'lightgrey',
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
});
