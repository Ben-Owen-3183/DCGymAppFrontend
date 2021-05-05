import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  ImageBackground
} from 'react-native';

const backgroundImagePath = '../assets/images/timetable-background.png';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordConf, setNewPasswordConf] = React.useState('');

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>


        <View style={{flex: 1}}></View>

        <View style={{flex: 5}}>

          <View style={{alignItems: 'center' }}>
            <Text style={styles.text}>
              Change your password
            </Text>

          </View>

          <View style={{marginVertical: 40}}></View>

          <TextInput
            value={currentPassword}
            onChangeText={text => setCurrentPassword(text)}
            style={styles.inputText}
            placeholder="Current Password"
            autoCompleteType={'password'}
            secureTextEntry={true}
            numberOfLines={1}
            placeholderTextColor={'lightgrey'}
            fontSize={18}
            color={'white'}
            keyboardAppearance={'dark'}
          />
          <View style={styles.line}></View>
          <View style={{marginVertical: 10}}></View>

          <TextInput
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            style={styles.inputText}
            placeholder="New Password"
            secureTextEntry={true}
            numberOfLines={1}
            placeholderTextColor={'lightgrey'}
            fontSize={18}
            color={'white'}
            keyboardAppearance={'dark'}
          />

          <View style={styles.line}></View>
          <View style={{marginVertical: 10}}></View>

          <TextInput
            value={newPasswordConf}
            onChangeText={text => setNewPasswordConf(text)}
            style={styles.inputText}
            placeholder="Confirm New Password"
            secureTextEntry={true}
            numberOfLines={1}
            placeholderTextColor={'lightgrey'}
            fontSize={18}
            color={'white'}
            keyboardAppearance={'dark'}
          />

          <View style={styles.line}></View>
          <View style={{marginVertical: 20}}></View>

          <TouchableHighlight
            onPress={() => navigation.reset({index: 0, routes: [{ name: 'Login' }],})}
            style={styles.button}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}>
            Submit
            </Text>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}
export default ChangePassword;


const styles = StyleSheet.create({
  line: {
    marginHorizontal: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
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
  button : {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  }
});
