import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { globalStyles } from '../styles/dcstyles';
import Image from 'react-native-scalable-image';
import { storeUserData } from '../shared/storage';
import { AuthContext } from '../routes/drawer';
import Settings from '../shared/settings';
import { SecondaryButton, PrimaryButton } from '../shared/basicComponents'
import DeviceInfo from 'react-native-device-info';
import {GlobalStyles, GlobalColors} from '../styles/dcstyles';
import {LoadingView} from '../shared/basicComponents';

import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const backgroundImagePath = '../assets/images/timetable-background.png';

const Errors = ({ errors }) => {
  return (
    <View style={{ backgroundColor: '#515151', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 }}>
      <Text style={[styles.errorText, { margin: 5 }]}>Please address the following issue{errors.length > 1 ? 's' : null}:</Text>
      {
        errors.map((error, i) => {
          return (
            <View style={{ margin: 5, flexDirection: 'row' }} key={i}>
              <View style={{ marginHorizontal: 7, flex: 0 }}>
                <Text style={[styles.errorText, { fontWeight: 'bold' }]}>-</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </View>
          )
        })
      }
    </View>
  )
}





const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Set an initializing state whilst Firebase connects
  const [initializingFirebase, setInitializingFirebase] = React.useState(true);
  // const [firebaseUser, setFirebaseUser] = React.useState(null);
  const [firebaseToken, setFirebaseToken] = React.useState('');
  const { setUserData } = React.useContext(AuthContext);

  React.useEffect(() => {
    try {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    } catch (error) {
      
    }
  }, []);

  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
  
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }
  requestUserPermission();

  async function onAuthStateChanged(firebaseUser) {
    try {
      // setFirebaseUser(firebaseUser);
      if(firebaseUser){
        // var response = await firebaseUser.getIdToken();
        messaging()
        .getToken()
        .then(token => {
          // console.log(token);
          setFirebaseToken(token)
        });
      }
      if (initializingFirebase) setInitializingFirebase(false);
    } catch (error) {
      console.log("onAuthStateChanged: " + error);
    }
  }

  try {
    auth()
    .signInAnonymously()
    .then(() => {
      // console.log('User signed in anonymously');
    })
    .catch(error => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }
      console.error(error);
    });
  } catch (error) {
    console.error(error);
  }



  async function registerDevice(token) {
    try {
      let response = await fetch(Settings.siteUrl + '/user/devices/', {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Token " + token
        },
        body: JSON.stringify({
          registration_id: firebaseToken,
          device_id: DeviceInfo.getUniqueId(),
          type: Platform.OS
        }),
      });
  
      let data = await response.json();
  
      console.log(JSON.stringify(data));
  
    } catch (e) {
      console.log('Register Device: ' + e);
    }
  }

  function onSubmit(username, password, setIsLoading, setErrors) {
    if (isLoading)
      return;

    setErrors(null);
    let payload = {
      'username': username,
      'password': password,
    }

    const onSuccess = (response) => {
      setIsLoading(false);
      // user logged in
      if (response['token']) {
        storeUserData(response);
        setUserData(response);
        registerDevice(response['token']);
      }
      // user did not login :(
      else {
        let newErrors = [];
        if (response['non_field_errors'])
          newErrors.push('The email or password provided is incorrect. Please check they are correct and try again')
        if (response['username'])
          newErrors.push('The email field cannot be blank. Enter the correct email to sign in')
        if (response['password'])
          newErrors.push('The password field cannot be blank. Enter the correct password to sign in')
        if (response['membership'])
          newErrors.push('You are currently not an active member of David Corfields Gymnasium. Please join or rejoin the gym to access the app. If you have just signed up to the gym, please wait at least 5 minutes for your membership status to be processed and try again. If that also fails please get in contact so we can resolve this issue.')

        if (newErrors.length > 0)
          setErrors(newErrors)
      }

    };

    const onFailure = (response) => {
      setIsLoading(false);
      setErrors(['Server cannot be reached. Make sure you are connected to the internet']);
    };

    setIsLoading(true);

    fetch(Settings.siteUrl + '/auth/login/', {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(response => { onSuccess(response) })
      .catch(response => { onFailure(response) })
  }

  if(initializingFirebase){
    return (
      <View style={{flex: 1, backgroundColor: GlobalColors.dcGrey}}>
        <LoadingView text={'Attempting to log\nin anonymously to firebase...'} useBackground={true}/>
      </View>
    )
  }

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{ width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View>
          <View style={{ flex: 1 }}></View>
          <View style={styles.mainContainer}>
            <View style={{ flex: 1 }}></View>

            <View style={{ flex: 5 }}>
              <View style={{ flex: 1 }}></View>
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                  width={Dimensions.get('window').width * 0.8}
                  source={require('../assets/images/DC-logo.png')} />
              </View>
              <View style={{ flex: 1 }}></View>
              <TextInput
                value={username}
                autoCompleteType={'email'}
                autoCapitalize="none"
                onChangeText={text => setUsername(text)}
                style={styles.inputText}
                placeholder="Email"
                numberOfLines={1}
                keyboardType={'email-address'}
                placeholderTextColor={'lightgrey'}
                fontSize={18}
                color={'white'}
                keyboardAppearance={'dark'}
              />

              <View style={styles.inputContainer}></View>
              <View style={{ marginVertical: 10 }}></View>

              <TextInput
                value={password}
                autoCompleteType={'password'}
                onChangeText={text => setPassword(text)}
                style={styles.inputText}
                keyboardAppearance={'dark'}
                blurOnSubmit={true}
                numberOfLines={1}
                placeholder="Password"
                textContentType={'password'}
                secureTextEntry={true}
                placeholderTextColor={'lightgrey'}
                fontSize={18}
                color={'white'}
              />
              <View style={styles.inputContainer}></View>

              <View style={{ marginVertical: 20 }}>
                {errors ? <Errors errors={errors} /> : null}
              </View>



              <PrimaryButton
                onPress={() => onSubmit(username, password, setIsLoading, setErrors)}
                text={'Login'}
                isLoading={isLoading}
              />
              <View style={{ marginVertical: 10 }}></View>
              <SecondaryButton
                onPress={() => navigation.navigate('SignupStep1')}
                text={'Sign up'}
              />

              <TouchableHighlight
                underlayColor={null}
                onPress={() => navigation.navigate('ForgottenPassword')}
                style={{ alignItems: 'center', marginVertical: 15 }}>
                <Text style={[styles.text, { color: '#FFC300', fontWeight: 'bold' }]}> forgotten password? </Text>
              </TouchableHighlight>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 8
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  inputText: {
    paddingVertical: 15,
  },
  inputContainer: {
    marginHorizontal: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  button: {
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor: 'white'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    alignItems: 'center',
  },
});
