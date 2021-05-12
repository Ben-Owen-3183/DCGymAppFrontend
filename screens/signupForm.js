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
import Settings from '../shared/settings';

const backgroundImagePath = '../assets/images/timetable-background.png';

const SignupForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailConf, setEmailConf] = useState('');
  const [fName, setFName] = useState('');
  const [sName, setSName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  function onSubmit(){
    if(isLoading)
      return;

    setErrors(null);
    setIsLoading(true)
    let payload = {
      'fName': fName,
      'sName': sName,
      'password': password,
      'passwordConf': passwordConf,
      'email': email,
      'emailConf': emailConf
    }

    const onSuccess = (response) => {
      setIsLoading(false);
      if(response['errors']['name'].length > 0
        || response['errors']['email'].length > 0
        || response['errors']['password'].length > 0){
        setErrors(response['errors'])
      } else {
        // If no errors...
          setPassword('');
          setPasswordConf('');
          navigation.reset({index: 0,routes: [{ name: 'VerifyEmail' }],});
      }

    };

    const onFailure = (response) => {
        setIsLoading(false);
        setErrors({'server': 'Server cannot be reached! Make sure you are connected to the internet'});
    };

    setIsLoading(true);

    fetch(Settings.siteUrl + '/signup/', {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})

  }

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
            <Names state={{fName, setFName, sName, setSName, errors}}/>
            <Email state={{email, setEmail, emailConf, setEmailConf, errors}}/>
            <Password state={{password, setPassword, passwordConf, setPasswordConf, errors}}/>

            { errors && errors['server'] ?
              (
                <View>
                  <View style={{marginVertical: 20}}></View>
                  <View style={styles.errorViewFree}>
                    <Text style={styles.errorText}>{errors['server']} </Text>
                  </View>
                </View>
              ) : (
              null)
            }


            <View style={{marginVertical: 20}}></View>
            <TouchableHighlight
              underlayColor={'#dba400'}
              onPress={() => onSubmit()}
              style={[styles.button, {backgroundColor: '#FFC300'}]}>

              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? <View style={{flex: 1}}></View> : null}
                <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Submit </Text>
                {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
              </View>
            </TouchableHighlight>
          </View>

          <View style={{flex: 1}}></View>
        </View>
        <View style={{padding: 60}}></View>
      </ScrollView>
    </ImageBackground>
  );
}

const Errors = ({ errors }) => {
  return(
    <View style={styles.errorView}>
    <Text style={styles.errorText}>Please address the following issue{errors.length > 1 ? 's' : null}:</Text>
    {
      errors.map((error, i) => {
        return(
          <View style={{margin: 5, flexDirection: 'row'}} key={i}>
            <View style={{marginHorizontal: 7, flex: 0}}>
              <Text style={[styles.errorText, {fontWeight: 'bold'}]}>-</Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        )
      })
    }
    </View>
  )
}

const Email = (state) => {
  const email = state.state.email;
  const setEmail = state.state.setEmail;
  const emailConf = state.state.emailConf;
  const setEmailConf = state.state.setEmailConf;

  let errors = null;
  if(state.state.errors)
    if(state.state.errors.email)
      if(state.state.errors.email.length)
        errors = state.state.errors.email

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

      <View style={[styles.subFormContainer, errors ? styles.ifErrors : null]}>
        <View style={{marginBottom: 10, marginTop: 5, marginLeft : 3 }}>
          <Text style={styles.text}>
            Please ensure the email you use is the one
            you used when intially signing up to David Corfields Gymnasium.
          </Text>
        </View>

        <TextInput
          value={email}
          onChangeText={email => setEmail(email)}
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
          value={emailConf}
          onChangeText={emailConf => setEmailConf(emailConf)}
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
      {errors
      ? (
        <Errors errors={errors}/>
      ) : (
        null
      )}
    </View>
  )
}

const Names = (state) => {
  const fName = state.state.fName;
  const setFName = state.state.setFName;
  const sName = state.state.sName;
  const setSName = state.state.setSName;
  let errors = null;
  if(state.state.errors)
    if(state.state.errors.name)
      if(state.state.errors.name.length)
        errors = state.state.errors.name

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

      <View style={[styles.subFormContainer, errors ? styles.ifErrors : null]}>
        <TextInput
          value={fName}
          onChangeText={fName => setFName(fName)}
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
          value={sName}
          onChangeText={sName => setSName(sName)}
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
      {errors
      ? (
        <Errors errors={errors}/>
      ) : (
        null
      )}
    </View>
  )
}

const Password = (state) => {
  const password = state.state.password;
  const passwordConf = state.state.passwordConf;
  const setPassword = state.state.setPassword;
  const setPasswordConf = state.state.setPasswordConf;
  let errors = null;
  if(state.state.errors)
    if(state.state.errors.password)
      if(state.state.errors.password.length)
        errors = state.state.errors.password
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

      <View style={[styles.subFormContainer, errors ? styles.ifErrors : null]}>
        <TextInput
          value={password}
          onChangeText={password => setPassword(password)}
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
          value={passwordConf}
          onChangeText={passwordConf => setPasswordConf(passwordConf)}
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
      {errors
      ? (
        <Errors errors={errors}/>
      ) : (
        null
      )}
    </View>
  )
}

export default SignupForm;


const styles = StyleSheet.create({
  mainContainer: {
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
  },
  inputText: {
    paddingVertical: 10,
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
  ifErrors: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
  errorView: {
    backgroundColor: '#b10000',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: 'lightgrey',
    borderWidth: 1,
    paddingVertical : 4,
    paddingHorizontal: 20
  },
  errorViewFree: {
    backgroundColor: '#b10000',
    borderRadius: 10,
    borderColor: 'lightgrey',
    borderWidth: 1,
    paddingVertical : 15,
    paddingHorizontal: 20
  },
  errorText: {
    color : 'white',
    fontSize : 16,
  }
});
