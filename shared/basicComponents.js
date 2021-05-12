import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

export const PrimaryButton = ({text, onPress, isLoading}) => {
  return(
    <TouchableHighlight
      underlayColor={'#dba400'}
      onPress={onPress}
      style={[styles.button, {}]}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading ? <View style={{flex: 1}}></View> : null}
        <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> {text} </Text>
        {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
      </View>
    </TouchableHighlight>
  )
}

export const SecondaryButton = ({text, onPress, isLoading}) => {
  return(
    <TouchableHighlight
      underlayColor={'#dba400'}
      onPress={onPress}
      style={[styles.button, {}]}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading ? <View style={{flex: 1}}></View> : null}
          <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> {text} </Text>
        {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
      </View>
    </TouchableHighlight>
  )
}


const styles = StyleSheet.create({
  text: {
    color : 'white',
    fontSize : 20,
  },
  errorText: {
    color : 'white',
    fontSize : 16,
  },
  button : {
    backgroundColor: '#FFC300',
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
  },
});
